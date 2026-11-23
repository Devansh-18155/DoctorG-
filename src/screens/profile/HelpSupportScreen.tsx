import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronDown, ChevronUp, HelpCircle, MessageSquare, Phone, Send, CheckCircle2 } from 'lucide-react';

export const HelpSupportScreen: React.FC = () => {
  const { goBack, showToast } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Booking Help');
  const [message, setMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      q: 'How does the Live Clinic Queue patient number system work?',
      a: 'When you book an appointment, an official 3-digit Patient Number is allocated. On your consultation day, you can view the live doctor counter from the "Live Queue" screen, showing the exact patient number currently consulting in the OPD chamber and estimated waiting minutes.',
    },
    {
      q: 'What is the appointment cancellation and refund policy?',
      a: 'You can cancel any scheduled OPD appointment free of charge up to 2 hours before the time slot. 100% refund is initiated automatically to your original payment method within 24-48 business hours.',
    },
    {
      q: 'How do I upload a prescription for doorstep medicine delivery?',
      a: 'Go to Medical Store, tap "Upload Rx", and attach a photo or PDF of your doctor prescription. Our certified pharmacist will verify the salts and prepare your medicine order.',
    },
    {
      q: 'Are emergency ambulances equipped with trained paramedics?',
      a: 'Yes, our Advanced Life Support (ALS) and ICU ambulances carry trained paramedics, defibrillators, oxygen cylinders, and life-support ventilators.',
    },
    {
      q: 'Are traditional healing services a substitute for medical treatment?',
      a: 'No. Doctor G strictly advises that traditional practices (Ayurveda, Naturopathy, Homeopathy) are complementary wellness therapies and must never replace modern medical or emergency intervention in acute illnesses.',
    },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('Please describe your issue', 'warning');
      return;
    }
    setTicketSent(true);
    showToast('Support ticket #DG-SUP-7721 created! Our support team will reply via email.', 'success');
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">Help & Support Center</span>

        <span className="w-8"></span>
      </div>

      <div className="p-4 space-y-4">
        {/* Contact Help desk banner */}
        <div className="bg-gradient-to-r from-teal-800 to-[#172B4D] rounded-3xl p-4 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
              24x7 Customer Care
            </span>
            <h3 className="font-extrabold text-sm text-white mt-0.5">Need Instant Assistance?</h3>
            <p className="text-[11px] text-teal-100 mt-0.5">
              Call our toll-free patient helpdesk
            </p>
          </div>
          <a
            href="tel:18001234567"
            className="px-3 py-2 bg-white text-teal-800 hover:bg-teal-50 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>1800-123-4567</span>
          </a>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3">
          <h4 className="font-extrabold text-xs text-[#172B4D]">Frequently Asked Questions</h4>
          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="py-2.5">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-teal-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Support Ticket Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3">
          <h4 className="font-extrabold text-xs text-[#172B4D]">Submit a Support Ticket</h4>

          {ticketSent ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
              <h5 className="font-bold text-xs text-emerald-900">Ticket #DG-SUP-7721 Logged</h5>
              <p className="text-[11px] text-emerald-700">
                A dedicated healthcare coordinator will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Booking Help">Booking & Queue Help</option>
                  <option value="Payment & Refunds">Payment & Refunds</option>
                  <option value="Medicine Delivery">Medicine Delivery Enquiry</option>
                  <option value="Lab Test Report">Lab Test Reports</option>
                  <option value="Ambulance Service">Ambulance Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of the issue"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Detailed Message</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue with booking IDs if applicable..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-xs"
              >
                Submit Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
