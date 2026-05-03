import { useEffect, useRef, useState } from "react";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
let googleScriptPromise = null;
let googleInitializedClientId = null;
let activeCredentialHandler = null;

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

const initializeGoogle = () => {
  if (!window.google?.accounts?.id || !googleClientId) return false;

  if (googleInitializedClientId !== googleClientId) {
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => activeCredentialHandler?.(response.credential),
    });
    googleInitializedClientId = googleClientId;
  }

  return true;
};

export default function GoogleAuthButton({
  onCredential,
  disabled = false,
  label = "Continue with Google",
  googleText = "continue_with",
  onMissingConfig,
}) {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!googleClientId) return undefined;
    let mounted = true;

    activeCredentialHandler = onCredential;

    loadGoogleScript()
      .then(() => {
        if (!mounted || !buttonRef.current || !initializeGoogle()) return;

        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          width: buttonRef.current.offsetWidth || 320,
          text: googleText,
        });
        setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(false);
      });

    return () => {
      mounted = false;
    };
  }, [googleText, onCredential]);

  if (!googleClientId) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onMissingConfig}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md disabled:opacity-60"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-base font-bold text-red-500 shadow-sm">
          G
        </span>
        {label}
      </button>
    );
  }

  return (
    <div
      className={`min-h-[44px] w-full overflow-hidden rounded-full ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      {!ready && (
        <div className="flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600">
          {label}
        </div>
      )}
      <div ref={buttonRef} className={ready ? "w-full" : "hidden"} />
    </div>
  );
}
