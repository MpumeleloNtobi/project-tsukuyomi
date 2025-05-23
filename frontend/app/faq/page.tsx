"use client";

import React, { useState } from "react";
import Header from "@/components/Header";

export type QuestionType = {
  value: string;
  question: string;
  answer: string;
};

const FAQPage = () => {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header showCart={false} />
      <section className="w-full max-w-4xl px-6 pt-16 md:py-16 mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-gray-900 text-center">
          Frequently Asked Questions
        </h1>

        <div className="space-y-16">
          <SectionComponent
            id="buyer"
            heading="Buyer"
            color="blue"
            questions={buyerQuestions}
          />

          <SectionComponent
            id="artisan"
            heading="Artisan"
            color="emerald"
            questions={artisanQuestions}
          />

          <SectionComponent
            id="admin"
            heading="Admin"
            color="rose"
            questions={adminQuestions}
          />

          <SectionComponent
            id="payment"
            heading="Payment"
            color="amber"
            questions={paymentQuestions}
          />
        </div>
      </section>
    </main>
  );
};

type SectionProps = {
  id: string;
  heading: string;
  color: "blue" | "emerald" | "rose" | "amber";
  questions: QuestionType[];
};

const SectionComponent: React.FC<SectionProps> = ({ id, heading, color, questions }) => {
  const [openValue, setOpenValue] = useState<string | null>(null);

  const toggle = (value: string) => {
    setOpenValue((prev) => (prev === value ? null : value));
  };

  return (
    <section id={id} className="w-full">
      <h2 className={`text-2xl font-semibold mb-8`}>
        {heading}
      </h2>

      <div className="space-y-4">
        {questions.map(({ value, question, answer }) => (
          <div key={value} className="border rounded-lg bg-white shadow-sm">
            <button
              onClick={() => toggle(value)}
              className={`w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                openValue === value ? `bg-gray-50` : ""
              }`}
              aria-expanded={openValue === value}
            >
              <span className="font-medium text-gray-900">{question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  openValue === value ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openValue === value && (
              <div className="px-6 pb-6 pt-2 text-gray-600">
                {answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const buyerQuestions = [
  {
    value: "b1",
    question: "How do I create an account?",
    answer: `Creating an account is easy. Click the 'Sign Up' button, provide your name, email, and create a secure password. You can also sign up using Google or Facebook. After registering, verify your email through the link sent to you, then log in to start shopping.`
  },
  {
    value: "b2",
    question: "How can I track my order?",
    answer: `Once your order ships, you will receive a tracking number via email. You can check the status in your account under 'My Orders.' Updates are also sent via SMS or email as your package progresses through shipping stages.`
  },
  {
    value: "b3",
    question: "What payment methods are accepted?",
    answer: `We accept major credit and debit cards (Visa, MasterCard, Amex), mobile money, PayPal, and bank transfers. All payments are processed securely with encryption to protect your data.`
  },
  {
    value: "b4",
    question: "Can I return a product if I'm not satisfied?",
    answer: `Yes, returns are accepted within 14 days of delivery if the product is unused and in original packaging. Initiate a return through your account dashboard, ship the item back, and we’ll refund or exchange after inspecting the return.`
  },
  {
    value: "b5",
    question: "How do I contact customer support?",
    answer: `Customer support is available via live chat on the site, email, or phone during business hours. For faster service, have your order number ready when contacting us.`
  },
  {
    value: "b6",
    question: "What should I do if I receive a damaged product?",
    answer: `If your item arrives damaged, contact support within 48 hours with photos and order details. We will assist you with a return or replacement at no extra cost.`
  },
  {
    value: "b7",
    question: "Can I cancel or change my order after placing it?",
    answer: `Order changes or cancellations are possible only within 2 hours of placement. Contact support immediately to request changes. After this period, the order is processed and cannot be altered.`
  },
  {
    value: "b8",
    question: "Do you offer gift wrapping or personalized messages?",
    answer: `Yes, gift wrapping and personalized message options are available for many products at checkout for an additional fee.`
  },
  {
    value: "b9",
    question: "Are prices inclusive of taxes and shipping?",
    answer: `Product prices include applicable taxes. Shipping fees are calculated separately based on your location and chosen delivery method. All costs are clearly shown before checkout.`
  },
  {
    value: "b10",
    question: "How long does shipping take?",
    answer: `Standard shipping takes 5-7 business days. Express options deliver in 1-3 business days. Estimated delivery dates are provided during checkout and in your order confirmation email.`
  },
  {
    value: "b11",
    question: "Can I change my shipping address after placing an order?",
    answer: `You can update your shipping address only if the order has not been dispatched. Contact support immediately with the new address to request a change.`
  },
  {
    value: "b12",
    question: "Is it safe to shop on your platform?",
    answer: `Yes. We use SSL encryption and strict security protocols to protect your data. Our platform vets sellers to ensure quality and authenticity.`
  },
  {
    value: "b13",
    question: "How do I save items to my wishlist?",
    answer: `Click the heart icon on a product page to add it to your wishlist. You must be logged in. Access your wishlist anytime from your account dashboard.`
  },
  {
    value: "b14",
    question: "Do you offer international shipping?",
    answer: `Currently, we ship to select countries. Check our shipping policy or contact support for the latest international shipping options and costs.`
  },
  {
    value: "b15",
    question: "How do I leave a review for a product?",
    answer: `After delivery, you’ll receive an email invite to review your purchase. You can also write a review on the product page. Reviews help other buyers and artisans improve.`
  }
];

const artisanQuestions = [
  {
    value: "a1",
    question: "How do I register as an artisan?",
    answer: `Go to 'Become a Seller' and fill out your personal and business details. Submit identification and product information. Our team reviews your application within 3-5 business days. Upon approval, you’ll get artisan dashboard access to start selling.`
  },
  {
    value: "a2",
    question: "How do I list my products?",
    answer: `In your artisan dashboard, click 'Add Product,' enter detailed descriptions, upload images, set pricing and shipping options, then publish your listing to the marketplace.`
  },
  {
    value: "a3",
    question: "How do I get paid?",
    answer: `Payments are processed weekly after deducting platform fees. Earnings are transferred to your registered bank account. Track your sales and payouts in your dashboard.`
  },
  {
    value: "a4",
    question: "What fees do I pay as an artisan?",
    answer: `A 10% commission fee is charged on each sale. There are no upfront listing fees. Optional premium promotional services are available at extra cost.`
  },
  {
    value: "a5",
    question: "How do I handle returns?",
    answer: `If a buyer requests a return, you’ll be notified with details. Approve or reject based on your policy. For approved returns, refund the buyer after receiving the item back in original condition.`
  },
  {
    value: "a6",
    question: "Can I offer discounts or promotions?",
    answer: `Yes, create discounts or coupon codes through your dashboard. Set percentage discounts or limited-time offers to boost sales.`
  },
  {
    value: "a7",
    question: "How do I update product information?",
    answer: `Edit product details anytime in your dashboard by selecting the product and clicking 'Edit.' Update descriptions, prices, and images as needed.`
  },
  {
    value: "a8",
    question: "What if I need help using the dashboard?",
    answer: `Access tutorials and FAQs in the artisan help center. Contact artisan support by email or live chat for specific assistance.`
  },
  {
    value: "a9",
    question: "Can I sell products sourced from other suppliers?",
    answer: `Yes, provided you comply with quality standards and platform policies. Transparency about product origin is recommended to build buyer trust.`
  },
  {
    value: "a10",
    question: "How do I manage inventory?",
    answer: `Track stock levels via the inventory tool in your dashboard. Update quantities after sales or restocking. Receive low-stock alerts to replenish timely.`
  },
  {
    value: "a11",
    question: "How do I handle shipping?",
    answer: `Choose preferred shipping methods and rates in your profile. Print labels and track shipments via the dashboard. We partner with trusted carriers to simplify logistics.`
  },
  {
    value: "a12",
    question: "Can I communicate directly with buyers?",
    answer: `Yes, use the platform's secure messaging to answer questions, negotiate custom orders, or clarify details. Keep communications professional and timely.`
  },
  {
    value: "a13",
    question: "What quality standards must products meet?",
    answer: `Products should reflect authentic craftsmanship, accurate descriptions, and good condition. Our quality team reviews listings periodically to maintain marketplace standards.`
  },
  {
    value: "a14",
    question: "How do I handle custom orders?",
    answer: `Accept custom orders through buyer messaging. Agree on price, timeline, and details before starting. Update your listings if you offer customizations regularly.`
  },
  {
    value: "a15",
    question: "What if a buyer disputes a transaction?",
    answer: `Try to resolve disputes amicably via communication. If unresolved, the platform mediates based on transaction records and communications. Provide evidence like proof of delivery to support your case.`
  }
];

const adminQuestions = [
  {
    value: "ad1",
    question: "How do I approve new artisan registrations?",
    answer: `Review pending artisan applications in the admin panel. Check submitted documents and product samples. Approve those that meet standards to grant dashboard access. Notify artisans by email upon approval.`
  },
  {
    value: "ad2",
    question: "How do I manage disputes between buyers and sellers?",
    answer: `Access the 'Dispute Management' module to review cases. Analyze messages, transaction data, and evidence. Facilitate communication or apply platform policies such as refunds or account actions as needed.`
  },
  {
    value: "ad3",
    question: "How do I monitor platform performance?",
    answer: `Use the analytics dashboard for real-time insights on sales volume, user engagement, and disputes. Export reports for in-depth analysis to guide business decisions.`
  },
  {
    value: "ad4",
    question: "How can I update platform policies?",
    answer: `Modify terms, return policies, and fees through the admin settings. Communicate updates to users via email and site notifications to ensure transparency.`
  },
  {
    value: "ad5",
    question: "How do I manage product listings?",
    answer: `Edit, approve, or remove product listings flagged for quality or policy violations. Contact artisans with guidance to improve listings before removal.`
  },
  {
    value: "ad6",
    question: "How do I handle user reports of abuse or fraud?",
    answer: `Investigate reports via user history, transactions, and communications. Suspend or ban accounts as necessary to maintain platform integrity.`
  },
  {
    value: "ad7",
    question: "How do I manage payments and payouts?",
    answer: `Oversee payment gateway integrations and schedule artisan payouts. Resolve payment disputes or failed transactions promptly with finance.`
  },
  {
    value: "ad8",
    question: "How do I update platform content?",
    answer: `Edit homepage banners, FAQ sections, and policy pages through the content management system (CMS) for timely updates and marketing campaigns.`
  },
  {
    value: "ad9",
    question: "How do I generate reports for management?",
    answer: `Use built-in reporting tools to generate sales, user growth, and dispute resolution reports. Export to Excel or PDF for presentations.`
  },
  {
    value: "ad10",
    question: "What are best practices for security management?",
    answer: `Regularly update software, enforce strong password policies, monitor suspicious activity, and backup data daily to ensure platform security.`
  },
  {
    value: "ad11",
    question: "How do I onboard new admins?",
    answer: `Create admin accounts with role-based permissions. Provide training and documentation on platform tools and responsibilities.`
  },
  {
    value: "ad12",
    question: "How do I handle system downtime or maintenance?",
    answer: `Schedule maintenance during low traffic hours. Notify users in advance. Monitor system health and rollback changes if issues arise.`
  },
  {
    value: "ad13",
    question: "How do I manage marketing campaigns?",
    answer: `Coordinate with marketing to schedule promotions, update banners, and track campaign performance via analytics tools integrated into the platform.`
  },
  {
    value: "ad14",
    question: "How do I ensure compliance with data protection laws?",
    answer: `Implement data privacy policies, manage user consent, and conduct regular audits to comply with GDPR, POPIA, and other regulations.`
  },
  {
    value: "ad15",
    question: "How do I respond to user feedback?",
    answer: `Review feedback collected through surveys and support tickets. Prioritize improvements and communicate actions taken to users to enhance satisfaction.`
  }
];

const paymentQuestions = [
  {
    value: "p1",
    question: "What payment methods can I use?",
    answer: `We accept credit/debit cards, mobile money, PayPal, and bank transfers. Payment options are displayed at checkout based on your region.`
  },
  {
    value: "p2",
    question: "Is my payment information secure?",
    answer: `Yes, we use industry-standard SSL encryption and PCI DSS-compliant payment gateways to ensure your payment data is protected.`
  },
  {
    value: "p3",
    question: "When will I be charged?",
    answer: `Payments are charged immediately after order confirmation. For subscriptions or pre-orders, charges occur as specified in the terms.`
  },
  {
    value: "p4",
    question: "Can I save my payment details for future use?",
    answer: `Yes, you can securely save your payment methods in your account for faster checkout. You can remove or update saved methods anytime.`
  },
  {
    value: "p5",
    question: "What happens if my payment is declined?",
    answer: `If a payment fails, you’ll receive an error message with possible reasons. Check card details, balance, or contact your bank. You can retry with a different method.`
  },
  {
    value: "p6",
    question: "How do refunds work?",
    answer: `Refunds are processed to the original payment method within 7-10 business days after return approval. You’ll receive confirmation via email.`
  },
  {
    value: "p7",
    question: "Are there any payment fees?",
    answer: `We do not charge extra fees for payment processing. However, your bank or payment provider may charge fees depending on their policies.`
  },
  {
    value: "p8",
    question: "Can I pay in installments?",
    answer: `Installment payments are available on select products through partner financing options. Look for 'Pay in Installments' at checkout.`
  },
  {
    value: "p9",
    question: "How do I update my billing information?",
    answer: `Update your billing address and payment details in your account settings under 'Payment Methods.' This ensures invoices are accurate.`
  },
  {
    value: "p10",
    question: "Is mobile money accepted?",
    answer: `Yes, mobile money payments are supported in selected countries. Choose your mobile money provider at checkout and follow the prompts.`
  },
  {
    value: "p11",
    question: "How do I get a receipt for my purchase?",
    answer: `Receipts are emailed immediately after payment. You can also download receipts from your order history in your account dashboard.`
  },
  {
    value: "p12",
    question: "Can I use multiple payment methods for one order?",
    answer: `Currently, each order must be paid with a single payment method. You can split purchases into multiple orders if needed.`
  },
  {
    value: "p13",
    question: "How do I dispute a payment?",
    answer: `Contact our support team with order details and payment proof. We will investigate and resolve disputes as per our payment policies.`
  },
  {
    value: "p14",
    question: "What currencies do you accept?",
    answer: `Payments can be made in USD, EUR, GBP, and selected local currencies depending on your region. Currency selection is available at checkout.`
  },
  {
    value: "p15",
    question: "How do I change my payment method on an existing order?",
    answer: `Payment method changes are not possible after order confirmation. Cancel the order within allowed time and place a new order with your preferred payment method.`
  }
];

export default FAQPage;