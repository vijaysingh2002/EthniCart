import { useEffect, useState } from "react";

function InstallApp() {
    console.log("aliye re");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      setDeferredPrompt(event);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log(`Installation: ${outcome}`);

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) {
    return null;
  }

  return (
    <button
        onClick={handleInstall}
        className="fixed bottom-5 right-5 z-50 rounded-lg bg-[#C49A6C] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#B8895A] hover:scale-105"
    >
        📱Install App
    </button>
  );
}

export default InstallApp;