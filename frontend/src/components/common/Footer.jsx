export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-borderSoft mt-20 py-10">
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-textPrimary">
        {/* Brand */}
        <div>
          <h2 className="font-poppins text-xl font-semibold text-primary">
            GBPIET Notes
          </h2>
          <p className="font-inter mt-2 text-textSecondary">
            A clean and fast platform for sharing notes & solving doubts.
          </p>
        </div>

        {/* Links */}
        <div className="font-inter space-y-2">
          <p className="text-textPrimary font-semibold mb-2">Quick Links</p>
          <p className="hover:text-primary cursor-pointer">Notes</p>
          <p className="hover:text-primary cursor-pointer">Q&A</p>
          <p className="hover:text-primary cursor-pointer">Upload Notes</p>
        </div>

        {/* Contact */}
        <div className="font-inter space-y-2">
          <p className="text-textPrimary font-semibold mb-2">Contact</p>
          <p className="">support@gbpietnotes.com</p>
          <p className="">Pauri Garhwal, Uttarakhand</p>
        </div>
      </div>

      <div className="text-center mt-10 font-inter text-textSecondary">
        © {new Date().getFullYear()} GBPIET Notes — All Rights Reserved.
      </div>
    </footer>
  );
}
