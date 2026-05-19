export default function Footer(){
    return(
        <footer>
            <div>
                <p>Worker Management System</p>
                <div>
                    <p>Contact US</p>
                    <p>Email: support@workermanagement.com</p>
                    <p>Phone: +1 (555) 000-0000</p>
                    <p>Hours: Monday - Friday, 9am - 6pm</p>
                </div>
                <p>
                 © {new Date().getFullYear()} Worker Management System. All rights reserved.
                </p>
            </div>
        </footer>
    );
}