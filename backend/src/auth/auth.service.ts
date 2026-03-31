import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, tenantName } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create tenant and user in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: tenantName || `${firstName}'s Organization`,
          slug: this.generateSlug(tenantName || email),
          plan: 'FREE',
          status: 'TRIAL',
        },
      });

      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'ADMIN',
          tenantId: tenant.id,
        },
        include: {
          tenant: true,
        },
      });

      // Create default subscription
      await tx.subscription.create({
        data: {
          tenantId: tenant.id,
          plan: 'FREE',
          status: 'active',
          maxStores: 1,
          maxProducts: 100,
          maxEmailsPerMonth: 1000,
          maxSmsPerMonth: 100,
        },
      });

      return { user, tenant };
    });

    const token = this.generateToken(result.user);

    return {
      user: this.sanitizeUser(result.user),
      tenant: result.tenant,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      tenant: user.tenant,
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.sanitizeUser(user);
    }

    return null;
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { tenant: true },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

    this.logger.log(`Password reset requested for ${email}`);
    this.logger.log(`Reset URL (dev): ${resetUrl}`);

    try {
      await this.emailService.sendEmail(
        email,
        'Reset Your Password - Watkins AI',
        `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><h2>Reset Your Password</h2><p>Click the link below to reset your password. This link expires in 1 hour.</p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; border-radius: 8px; text-decoration: none;">Reset Password</a><p style="margin-top: 16px; color: #666;">If you didn't request this, you can safely ignore this email.</p></div>`,
      );
    } catch (err) {
      this.logger.warn('Failed to send reset email, URL logged above for dev use');
    }

    return { message: 'If an account exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (payload.type !== 'password-reset') {
      throw new BadRequestException('Invalid token type');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { password: hashedPassword },
    });

    return { message: 'Password has been reset successfully' };
  }

  async sendVerificationEmail(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      return { message: 'Email is already verified' };
    }

    const verifyToken = this.jwtService.sign(
      { sub: user.id, type: 'email-verify' },
      { expiresIn: '24h' },
    );

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/auth/verify-email?token=${verifyToken}`;

    this.logger.log(`Verification email requested for ${user.email}`);
    this.logger.log(`Verify URL (dev): ${verifyUrl}`);

    try {
      await this.emailService.sendEmail(
        user.email,
        'Verify Your Email - Watkins AI',
        `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><h2>Verify Your Email</h2><p>Click below to verify your email address. This link expires in 24 hours.</p><a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; border-radius: 8px; text-decoration: none;">Verify Email</a></div>`,
      );
    } catch (err) {
      this.logger.warn('Failed to send verification email, URL logged above for dev use');
    }

    return { message: 'Verification email sent' };
  }

  async verifyEmail(token: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (payload.type !== 'email-verify') {
      throw new BadRequestException('Invalid token type');
    }

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { emailVerified: true },
    });

    return { message: 'Email verified successfully' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 50);
  }
}
