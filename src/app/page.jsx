import Link from 'next/link';
import Navbar from '../components/Navbar'; // Import added
import Footer from '../components/Footer'; // Import added

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar /> {/* Placed at top */}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
            AI Chatbot That Understands <br />
            <span className="text-blue-600">Your Business</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Configure your categories, services, and products once. 
            HeyAiBot responds accurately, triggers actions, and captures leads 24×7.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/contact" className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500">
              Start Free Trial
            </Link>
            <Link href="/features" className="text-lg font-semibold leading-6 text-gray-900">
              View Features <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Value Prop */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-6">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold mb-2">Easy Setup</h3>
                    <p className="text-gray-600">Copy & paste one line of code to embed on any website.</p>
                </div>
                <div className="p-6">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold mb-2">Zero Hallucinations</h3>
                    <p className="text-gray-600">AI responds strictly based on your configured business data.</p>
                </div>
                <div className="p-6">
                    <div className="text-4xl mb-4">📈</div>
                    <h3 className="text-xl font-bold mb-2">Lead Capture</h3>
                    <p className="text-gray-600">Automatically collects visitor details and sends them to you.</p>
                </div>
            </div>
        </div>
      </section>

      <Footer /> {/* Placed at bottom */}
    </div>
  );
}