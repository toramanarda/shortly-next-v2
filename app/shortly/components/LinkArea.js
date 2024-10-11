"use client";
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useQRCode } from 'next-qrcode';

const urlSchema = z.string().url("Geçerli bir URL giriniz!");

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const LinkArea = () => {
  const { Canvas } = useQRCode();
  const [longUrl, setLongUrl] = useState('');
  const [shortUrls, setShortUrls] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [qrText, setQrText] = useState('');

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('shortUrls')) || [];
    setShortUrls(storedUrls);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = urlSchema.safeParse(longUrl);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      const generatedShortUrl = generateShortUrl();

      const response = await fetch("https://szatjmdyotqigrrlrrsb.supabase.co/rest/v1/urls", {
        method: "POST",
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6YXRqbWR5b3RxaWdycmxycnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDI2NjUsImV4cCI6MjA0MzM3ODY2NX0.QcXRZ82w4MCZ_UlpAsZCxHLlAgoHh6YNz3FYC9d6MW8", 
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6YXRqbWR5b3RxaWdycmxycnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDI2NjUsImV4cCI6MjA0MzM3ODY2NX0.QcXRZ82w4MCZ_UlpAsZCxHLlAgoHh6YNz3FYC9d6MW8", 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          long_url: longUrl,
          short_url: generatedShortUrl
        })
      });

      if (response.ok) {
        const newShortUrl = { longUrl, shortUrl: generatedShortUrl };
        const updatedShortUrls = [...shortUrls, newShortUrl];

        localStorage.setItem('shortUrls', JSON.stringify(updatedShortUrls));
        setShortUrls(updatedShortUrls);
        setLongUrl(''); 
      } else {
        throw new Error('Short URL oluşturulamadı');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const generateShortUrl = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const openModal = (url) => {
    setQrText(url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="linkArea">
      <form id="link-form" onSubmit={handleSubmit}>
        <input
          id="link-input"
          placeholder="Shorten a link here..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <button type="submit">Shorten It!</button>
      </form>

      <div id="shortened-links">
        {shortUrls.map((url, index) => (
          <div key={index} className="shortened-link">
            <p className='longurl'>{url.longUrl}</p>
            <a id="shortened-url" href={`/${url.shortUrl}`} target="_blank" rel="noopener noreferrer">
              {`${window.location.origin}/${url.shortUrl}`}
            </a>
            <div onClick={() => openModal(`${window.location.origin}/${url.shortUrl}`)}>
              <Canvas
                text={`${window.location.origin}/${url.shortUrl}`} 
                options={{
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 100,
                  color: {
                    dark: '#000',
                    light: '#fff',
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Modal isOpen={modalOpen} onClose={closeModal}>
        <h2>QR Code</h2>
        <Canvas
          text={qrText}
          options={{
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 200, 
            color: {
              dark: '#000',
              light: '#fff',
            },
          }}
        />
      </Modal>
    </div>
  );
};

export default LinkArea;
