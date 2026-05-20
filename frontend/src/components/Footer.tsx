export default function Footer() {
    return (
      <footer className="bg-gray-800 text-gray-300 mt-auto py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <p className="font-bold text-white text-lg mb-1">WorkerMS</p>
            <p className="text-sm text-gray-400">Managing your workforce efficiently.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Contact Us</p>
            <p className="text-sm">Email: support@workermanagement.com</p>
            <p className="text-sm">Phone: +1 (555) 000-0000</p>
            <p className="text-sm">Hours: Mon - Fri, 9am - 6pm</p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Worker Management System. All rights reserved.
        </p>
      </footer>
    );
  }