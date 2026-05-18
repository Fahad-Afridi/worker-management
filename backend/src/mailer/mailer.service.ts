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
        

}