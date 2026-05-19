export declare class EmailService {
    private transporter;
    private readonly logger;
    constructor();
    private initializeTransporter;
    sendwelcomeEmail(name: string, eamil: string): Promise<string | false>;
    sendPasswordResetEmail(name: string, email: string, token: string): Promise<string | false>;
}
