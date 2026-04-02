import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How fast is the conform process?",
    answer:
      "Haste Conform Studio completes complex conform tasks at 300X the speed of human teams. What once took days now takes seconds, without sacrificing accuracy.",
  },
  {
    question: "Is my media secure?",
    answer:
      "Your media never leaves your pipeline. Our platform is privacy-forward, built for TPN-compliant environments, and trusted by industry leaders.",
  },
  {
    question: "What formats do you support?",
    answer:
      "We support migration between Adobe Premiere, DaVinci Resolve, Avid Media Composer, and Pro Tools. More integrations are coming soon.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! We offer a 7-day free trial for all new users.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.",
  },
  {
    question: "What's included in Enterprise?",
    answer:
      "Enterprise includes unlimited seats, dedicated support, custom integrations, on-premise deployment options, and SLA guarantees. Contact us for a custom quote.",
  },
];

const FAQSection = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      {/* Section Label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <span className="section-label">FAQ</span>
      </motion.div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl md:text-5xl font-bold text-center mb-12 uppercase tracking-wide"
      >
        Frequently Asked Questions
      </motion.h2>

      {/* FAQ Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card rounded-lg px-4 transition-all duration-300 hover:border-white/15 relative overflow-hidden group"
            >
              {/* Gradient top-edge accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
              <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 text-sm md:text-base leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
};

export default FAQSection;
