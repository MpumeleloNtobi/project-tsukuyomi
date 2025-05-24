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
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <Header showCart={false} />
      <section className="w-full max-w-4xl px-6 pt-16 md:py-16 mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">
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
      <h2 className="text-2xl font-semibold mb-8">{heading}</h2>

      <div className="space-y-4 rounded-lg">
        {questions.map(({ value, question, answer }) => (
          <div key={value} className="border rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700">
            <button
              onClick={() => toggle(value)}
              className={`w-full flex justify-between items-center px-6 py-4 text-left transition-colors cursor-pointer rounded-lg ${
                openValue === value
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              aria-expanded={openValue === value}
            >
              <span className="font-medium">{question}</span>
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
              <div className="px-6 pb-6 pt-2 text-gray-700 dark:text-gray-300">
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
    question: "How do I sign-up / sign-in for the application?",
    answer: `
      You can easily sign-in / sign-up by creating the button on the top right of your screen on the landing page of the application. 
      Then you will be presented with an option to sign-up / login using a gmail address or using Microsoft. From there you can pick your 
      preferred option and follow the rest ofv the instructions. 
    `
  },
  {
    value: "b2",
    question: "How can I track my order?",
    answer: `
      Yes, you have to open the order on the app to see the status.
    `
  },
  {
    value: "b3",
    question: "What payment methods are accepted?",
    answer: `
      Only electronic payment via the payment gataway that you will get presented with on order checkout. We do not do cash on delivery.
      your order will not be placed until you make a payment on the app.
    `
  },
  {
    value: "b4",
    question: "How do I contact customer support?",
    answer: `
      Please use the links on the footer of the website to reach out to us.
    `
  },
  {
    value: "b6",
    question: "What should I do if I receive a damaged product?",
    answer: `
      If your item arrives damaged, please use the links on the footer of the website to reach out to us.
      We will assist you with a return or replacement at no extra cost.
    `
  },
  {
    value: "b7",
    question: "Can I cancel or change my order after placing it?",
    answer: `
      No, once an order is placed successfully it cannot be cancelled or updated.
    `
  },
  {
    value: "b9",
    question: "Are prices inclusive of taxes and shipping?",
    answer: `
      Product prices are inclusive of VAT and shipping costs.
    `
  },
  {
    value: "b10",
    question: "How long does shipping take?",
    answer: `
      Standard shipping takes 5-7 business days. Should the seller not be able to deliver within 7 days they are required to reach out to you 
      via email and update you on the status of your order and details on the the cause of the delay.
    `
  }
];

const artisanQuestions = [
  {
    value: "a1",
    question: "How do I register to become a Seller?",
    answer: `
      Look for the 'Become a Seller' button on the top right of the landing page of the app. After clicking the button you will be presented with 
      a form to fill out. Once you have successfully submitted the form you will now be recognised as a Seller on the app and have access to all 
      the Seller related functionalities.
    `
  },
  {
    value: "a2",
    question: "How do I list my products?",
    answer: `
      Make sure that you are registered to be a Seller first. Then you will be able to view your store, all your listed products, and add a new 
      product buy clicking the 'Add Product' button within your store interface where you will then presented with a form to to fill out and submit.
      Once, the product as been successfully submited, the product will be listed in your store interface.
    `
  },
  {
    value: "a3",
    question: "How do I get paid?",
    answer: `
      Party of the registration process to become a Seller on the app is that you will be prompted to create an account with Stitch (3rd party service 
      provider) used to facilited and provide the Stitch ID to the app which will be provided to you by Stitch once you have created an account with them.
      Please note that this is a requirement to become a Seller on the app. Once all the admin is done and your store is up and running on the app 
      all payments will be facilited using on the app using Stitch and money will be transferred directly from a Buyer's account to your account.
    `
  },
  {
    value: "a5",
    question: "How do I handle returns?",
    answer: `
      If a buyer requests a return, you’ll be notified with details via email only if the request is valid. Arrangements will be facilitted by us between y
      ourself and the Buyer and details of the return will be communicated accordingly.
    `
  },
  {
    value: "a7",
    question: "How do I update product information?",
    answer: `Edit product details anytime in within the 'View Store' interface by selecting the product and clicking 'Edit.' Update descriptions, prices, and images as needed.`
  },
  {
    value: "a10",
    question: "How do I manage inventory?",
    answer: `
      The app comes with an inventory management page with functionalities to track your products' stock levels and to update quantities after sales or restocking.
    `
  },
  {
    value: "a13",
    question: "What quality standards must products meet?",
    answer: `
      Products should reflect authentic craftsmanship, accurate descriptions, and good condition. Our quality team reviews listings periodically to maintain 
      marketplace standards.
    `
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
    answer: `
      As an admin on the app you will have permissions to update or remove any product / store on the app but will be required send an email to the affected Seller 
      informing them of the actions taken and an explanation.
    `
  },
  {
    value: "ad11",
    question: "How do I onboard new admins?",
    answer: `You will only be required to monitor new requests to become a Seller / Admin on the app and approve or reject requests on the app.`
  }
];

const paymentQuestions = [
  {
    value: "p1",
    question: "What payment methods can I use?",
    answer: `
      We only accept payments on the app via our reliable and trusted payment gateway service provider Stitch.
    `
  },
  {
    value: "p2",
    question: "Is my payment information secure?",
    answer: `
      Yes, Stitch strictly adheres to security industry standards. Please check their website on https://www.stitch.money/ for more information on this.
    `
  },
  {
    value: "p5",
    question: "What happens if my payment is declined?",
    answer: `
      If a payment fails, you’ll receive an error message with possible reasons. Check card details, balance, or contact your bank.
    `
  },
  {
    value: "p6",
    question: "How do refunds work?",
    answer: `
      Refunds are processed to the original payment method within 7-10 business days after return approval. You’ll receive confirmation via email.
    `
  },
  {
    value: "p7",
    question: "Are there any payment fees?",
    answer: `
      We do not charge extra fees for payment processing. However, your bank or payment provider may charge fees depending on their policies.
    `
  },
  {
    value: "p12",
    question: "Can I use multiple payment methods for one order?",
    answer: `
      Currently, we are only allowing a single method of payment - electronic payments via the app.
    `
  },
  {
    value: "p13",
    question: "How do I dispute a payment?",
    answer: `
      Please reach out to us via the contact links on the footer of the app with order details and payment proof. 
      We will investigate and resolve disputes.
    `
  }
];

export default FAQPage;