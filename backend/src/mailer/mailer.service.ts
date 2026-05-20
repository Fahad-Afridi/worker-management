import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService{
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor(){
        this.initializeTransporter();
    }

    private async initializeTransporter(){
        const testAccount = await nodemailer.createTestAccount();

        this.transporter=nodemailer.createTransport({
            host : 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth:{
                user: testAccount.user,
                pass: testAccount.pass
            },
        });
        this.logger.log(`Ethereal eamil user: ${testAccount.user}`);
        this.logger.log(`Ethereal eamil pass: ${testAccount.pass}`);
    }

    async sendwelcomeEmail(name:string, eamil: string){
        const info = await this.transporter.sendMail({
            from:'"Worker Management" <np-replu@worker.com ',
            to : eamil,
            subject: 'Welcome to Worker Management System',
            html: `
                <h1>Welcome, ${name}!</h1>
                <P>You can now login and start managing your task.</p>
                <br/>
                <p>Best regards,</p>
                `,

        });

        this.logger.log(`Email sent to ${eamil}`);
        this.logger.log(`Preview URL : ${nodemailer.getTestMessageUrl(info)}`);

        return nodemailer.getTestMessageUrl(info);
    }

    async sendPasswordResetEmail(name: string, email: string, token: string){
        const resetUrl = `http://localhost:4000/reset-password?token=${token}`;// ${token} placeholder that expect value from valiable - token
        
        const info = await this.transporter.sendMail({
            from: '"Worker Management" <no-reply@worker.com',
            to: email,
            subject: 'Password Reset Request',
            html: `
            <h1>Hi ${name},</h1>
            <p>You requested to reset your password.</p>
            <p>Click the link below to reset ir.</p>
            <p>This link expires in <strong>15 minutes</strong>.</p>
            <br/>
            <a href="${resetUrl}"
                style="background:#4F46E5;color:white;padding:12px 24px;
                  border-radius:6px;text-decoration:none;">
                  Reset Password
                  </a>
                  <br/><br/>
                  <p>Or copy this link</p>
                  <p>${resetUrl}</p>
                  <br/>
                  <p>If you did not request this, ignore this eamil.</p>
                  <p>Your password will remain unchanged.</p>
                  `,
        });

        this.logger.log(`Password reset eamil sent to ${email}`);
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        return nodemailer.getTestMessageUrl(info)
    }
        

}