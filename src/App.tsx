import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Brain,
  Calendar,
  ChevronDown,
  Database,
  Dna,
  HeartPulse,
  Lock,
  MessageCircle,
  Microscope,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2
} from 'lucide-react';
import SplineScene from "./spline";

function App() {
  const [email, setEmail] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Microscope className="w-8 h-8 text-pink-300" />,
      title: "Intelligent Diagnoses",
      description: "Our patent-pending K-Pad uses an miRNA-based biomarker panel test to detect early-stage breast cancer through a multiplex sensor strip embedded into your form-fitting sanitary napkin."
    },
    {
      icon: <Calendar className="w-8 h-8 text-pink-300" />,
      title: "Convenient Care",
      description: "Say goodbye to uncomfortable, invasive breast check-ups. Grab our product off a retail aisle and exercise agency over your health - annually, or as frequently as your period!"
    },
    {
      icon: <Brain className="w-8 h-8 text-pink-300" />,
      title: "Clinical Grade AI Insights",
      description: "Our app leverages the power of artificial intelligence where you can simply take a picture of your visible strip, and our proprietary algorithms will detect a measurable color change in the form of specific miRNA detection, giving a prompt breast health reading and guiding your timely care."
    },
    {
      icon: <HeartPulse className="w-8 h-8 text-pink-300" />,
      title: "De-stigmatizing Periods",
      description: "Our priority beyond saving lives is to de-stigmatize menstrual blood and frame it as a source of health benefits, with each customer an activist for women's breast health access."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-pink-300" />,
      title: "Scientifically Backed",
      description: "We are backed by leading researchers in biotech and women's health from Google Health, Parkland Medicine Research Center, the U.S. Department of Health and Human Services, and Johnson & Johnson."
    },
    {
      icon: <Users className="w-8 h-8 text-pink-300" />,
      title: "Empowering You",
      description: "Founded by women. For women."
    }
  ];

  const faqs = [
    {
      question: "Is the K-Pad FDA approved?",
      answer: "The K-Pad is in the process of obtaining FDA approval for its diagnostic capabilities. It has been rigorously tested and designed to meet the highest safety and accuracy standards for health monitoring."
    },
    {
      question: "Do I need a doctor's visit to use the K-Pad?",
      answer: "No, the K-Pad is designed for at-home use and integrates seamlessly into your routine. However, if the results indicate the need for further evaluation, you should consult with a healthcare professional for follow-up care."
    },
    {
      question: "How often should I use the K-Pad?",
      answer: "The K-Pad is designed for use during your menstrual cycle, typically once per month. Regular use helps establish a continuous monitoring pattern, which is crucial for early detection of potential issues."
    },
    {
      question: "What makes the K-Pad different from traditional breast cancer screenings?",
      answer: "Unlike mammograms or biopsies, the K-Pad is non-invasive, affordable, and integrates into your natural routine. It provides an accessible, at-home alternative to traditional screenings, making early detection significantly more manageable and stress-free for all women."
    },
    {
      question: "Where will I be able to buy the K-Pad, and how much does it cost?",
      answer: "When launched, the K-Pad will be available online and through select retail stores. Priced at approximately $39 per unit, it offers a cost-effective solution for proactive health monitoring and early detection."
    },
    {
      question: "Can I use the K-Pad alongside other health monitoring devices?",
      answer: "Absolutely! The K-Pad complements other health monitoring tools and wearables, offering unique insights through menstrual biomarker analysis. It provides an additional layer of health data that can enhance your overall wellness routine."
    },
    {
      question: "How long will I have to wait for my results?",
      answer: "Results are available instantly after using the K-Pad and scanning it with our companion app. The app analyzes the biomarkers in seconds, providing you with clinical-grade insights right away."
    },
    {
      question: "How does the K-Pad protect my privacy?",
      answer: "The companion app processes all data securely using encrypted algorithms. Your health insights are accessible only to you unless you choose to share them with a healthcare provider."
    },
    {
      question: "How accurate are the results?",
      answer: "The K-Pad uses advanced biomarker detection and AI-powered analysis to deliver clinical-grade accuracy. The technology is rigorously validated to ensure reliable results, empowering users with trustworthy insights into their health."
    },
    {
      question: "Does the K-Pad detect other health issues besides breast cancer?",
      answer: "Currently, the K-Pad is focused on detecting early warning signs of breast cancer. However, the technology has the potential to expand into monitoring other health conditions in the future."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit email');
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setEmail('');
    } catch (error) {
      setSubmitError('Failed to join waitlist. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dna className="w-8 h-8 text-pink-300" />
            <span className="text-xl font-bold">Know.Period</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('waitlist')}
            className="bg-pink-300 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-pink-400 transition-colors"
          >
            Join Waitlist
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Spline Background with Parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{
            x: mousePosition.x,
            y: mousePosition.y
          }}
        >
          <SplineScene />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Early Breast Cancer Detection – Powered by Your Period
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white mb-12 max-w-3xl mx-auto font-bold mb-4"
          >
            Know.Period transforms menstrual blood into a powerful diagnostic tool, detecting early-stage breast cancer with a non-invasive, intelligent sanitary napkin solution.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(236, 191, 235, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('waitlist')}
              className="bg-pink-300 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-pink-400 transition-colors"
            >
              Join the Waitlist
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#how-it-works"
              className="inline-block text-pink-300 hover:text-pink-400 transition duration-300 mt-2"
            >
              <span className="flex items-center gap-2 text-lg font-semibold">
                Learn How It Works <ChevronDown className="animate-bounce" />
              </span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">The Breast Cancer Crisis</h2>
            <p className="text-xl text-gray-300 mb-12">
              1 in 8 women will be diagnosed with breast cancer in their lifetime. Early detection increases survival rates to nearly 100%, but current methods are expensive, invasive, and often inaccessible.
            </p>
            <div className="bg-gray-700 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Know.Period's Solution</h3>
              <p className="text-lg text-gray-300">
                Know.Period offers a breakthrough: an at-home, non-invasive early detection tool powered by menstrual blood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                className="bg-gray-800 p-8 rounded-2xl text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(236, 191, 235, 0.3)" }}
                  className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  {index === 0 && <Calendar className="w-8 h-8 text-pink-300" />}
                  {index === 1 && <Database className="w-8 h-8 text-pink-300" />}
                  {index === 2 && <MessageCircle className="w-8 h-8 text-pink-300" />}
                </motion.div>
                <h3 className="text-xl font-bold mb-4">Step {index + 1}</h3>
                <p className="text-gray-300">
                  {index === 0 && "Wear the pad as usual."}
                  {index === 1 && "Biomarkers in menstrual blood are analyzed using embedded sensors."}
                  {index === 2 && "Get results via a secure app."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Breast Health Monitoring as Routinely as Her Period
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300"
            >
              Unlocking a new Breast Cancer care paradigm
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gray-900 p-8 rounded-2xl"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mb-6"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 flex justify-between items-center text-left"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedFaq === index ? "auto" : 0,
                    opacity: expandedFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="waitlist" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-8"
          >
            Revolutionize Women's Health
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Join the waitlist & get exclusive updates!
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
          >
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full bg-gray-900 border border-gray-700 focus:outline-none focus:border-pink-300"
                required
                disabled={isSubmitting}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="bg-pink-300 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-pink-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Joining...' : 'Join Now'}
              </motion.button>
            </div>
            {submitError && (
              <p className="text-red-400 mt-2">{submitError}</p>
            )}
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400 space-y-2">
          <p>Email us at:  
            <a href="mailto:founders@know-period.com" className="text-pink-300 hover:underline">
              founders@know-period.com
            </a>
          </p>
          <p>&copy; {new Date().getFullYear()} Know.Period. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;