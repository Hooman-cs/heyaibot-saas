import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "HeyAiBot - AI Chatbots for Business",
  description: "Turn Website Visitors Into Leads With a Smart AI Chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

// import "./globals.css";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export const metadata = {
//   title: "HeyAiBot - AI Chatbots for Business",
//   description: "Turn Website Visitors Into Leads With a Smart AI Chatbot",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="flex-grow">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }