// Logic dùng chung cho mọi giao diện (theme): form Hero, máy tính báo giá, form liên hệ.
// Theme chỉ lo phần hiển thị; gửi dữ liệu và tính giá nằm ở đây để các theme luôn chạy giống nhau.
import { useEffect, useState } from 'react';
import { useSite } from './SiteContext';
import { api, fmt } from '../lib/api';

// Form nhanh ở Hero: lưu số điện thoại vào mục Liên hệ (source = hero), sau đó gọi onDone (thường là cuộn tới báo giá).
export function useLeadForm(onDone) {
  const { services } = useSite();
  const [quickPhone, setQuickPhone] = useState('');
  const [quickServiceId, setQuickServiceId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickRequest = (e) => {
    e.preventDefault();
    if (!quickPhone) return;
    setSubmitted(true);
    const svc = services.find((s) => s.id === quickServiceId) || services[0];
    api('/leads', { method: 'POST', body: { phone: quickPhone, serviceLabel: svc ? svc.heroLabel : '' } })
      .catch((err) => console.warn('Could not save quick request:', err.message));
    setTimeout(() => {
      if (onDone) onDone();
      setSubmitted(false);
    }, 1000);
  };

  return { quickPhone, setQuickPhone, quickServiceId, setQuickServiceId, submitted, handleQuickRequest };
}

// Máy tính báo giá + form gửi yêu cầu. Giá hiển thị là ước tính; server tính lại khi lưu (cùng công thức).
export function useQuoteForm(selectedServiceId) {
  const { settings, services, frequencyOptions } = useSite();
  const t = settings.calculator;
  const [serviceId, setServiceId] = useState(selectedServiceId || services[0]?.id);
  const [area, setArea] = useState(t.area_default);
  const [frequencyId, setFrequencyId] = useState(frequencyOptions[0]?.id);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (selectedServiceId) setServiceId(selectedServiceId);
  }, [selectedServiceId]);

  const currentService = services.find((s) => s.id === serviceId) || services[0] || { id: '', calcName: '', pricePerM2: 0, basePrice: 0 };
  const currentFrequency = frequencyOptions.find((f) => f.id === frequencyId) || frequencyOptions[0] || { id: null, label: '', discountPct: 0 };
  const discountPct = currentFrequency.discountPct || 0;
  const estimatedCost = Math.round((currentService.basePrice + (area * currentService.pricePerM2)) * (100 - discountPct)) / 100;

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      setErrorMsg(t.error_required);
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const data = await api('/quotes', {
        method: 'POST',
        body: {
          fullName, phone, email,
          serviceId: currentService.id,
          gardenArea: area,
          frequencyId: currentFrequency.id,
          frequency: currentFrequency.label,
          address, preferredDate, notes,
        },
      });
      setLoading(false);
      if (data.success) {
        setSuccessMsg(fmt(t.success_message, { id: data.quoteId }));
        setFullName(''); setPhone(''); setEmail(''); setAddress(''); setNotes('');
      } else {
        setErrorMsg(data.message || t.error_failed);
      }
    } catch (err) {
      setLoading(false);
      // Lỗi nghiệp vụ từ server (400) có message; lỗi mạng thì báo không kết nối được
      setErrorMsg(err.status ? (err.message || t.error_failed) : t.error_network);
    }
  };

  return {
    serviceId, setServiceId, area, setArea, frequencyId, setFrequencyId,
    fullName, setFullName, phone, setPhone, email, setEmail, address, setAddress,
    preferredDate, setPreferredDate, notes, setNotes,
    loading, successMsg, errorMsg,
    currentService, currentFrequency, discountPct, estimatedCost,
    handleSubmitQuote,
  };
}

// Form liên hệ.
export function useContactForm() {
  const { settings } = useSite();
  const t = settings.contact;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSendContact = async (e) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      setError(t.error_required);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await api('/contact', { method: 'POST', body: { name, phone, email, message } });
      setLoading(false);
      if (data.success) {
        setSuccess(data.message);
        setName(''); setPhone(''); setEmail(''); setMessage('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err.status ? err.message : t.error_network);
    }
  };

  return { name, setName, phone, setPhone, email, setEmail, message, setMessage, loading, success, error, handleSendContact };
}
