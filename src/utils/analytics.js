const GA_SCRIPT_ID = "ga4-script";
const CLARITY_SCRIPT_ID = "clarity-script";

const getGaMeasurementId = () => import.meta.env.VITE_GA_MEASUREMENT_ID;
const getClarityProjectId = () => import.meta.env.VITE_CLARITY_PROJECT_ID;

export const initGA = () => {
  const measurementId = getGaMeasurementId();
  if (!measurementId || typeof window === "undefined" || typeof document === "undefined") return;
  if (document.getElementById(GA_SCRIPT_ID)) return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  } catch (error) {
    // Analytics must never block the app.
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (!getGaMeasurementId() || typeof window === "undefined" || typeof window.gtag !== "function") return;

  try {
    window.gtag("event", eventName, params);
  } catch (error) {
    // Ignore analytics failures so product flows keep working.
  }
};

export const initClarity = () => {
  const projectId = getClarityProjectId();
  if (!projectId || typeof window === "undefined" || typeof document === "undefined") return;
  if (document.getElementById(CLARITY_SCRIPT_ID)) return;

  try {
    window.clarity =
      window.clarity ||
      function clarity() {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };

    const script = document.createElement("script");
    script.id = CLARITY_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${projectId}`;
    document.head.appendChild(script);
  } catch (error) {
    // Clarity is optional and should fail silently.
  }
};
