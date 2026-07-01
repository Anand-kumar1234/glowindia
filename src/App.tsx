import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Sparkles, 
  Camera, 
  CheckCircle, 
  Activity, 
  User, 
  DollarSign, 
  Loader2, 
  Download, 
  ShieldAlert, 
  RefreshCw, 
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Heart,
  Droplet,
  Flame,
  Search,
  BookOpen,
  PenTool,
  Trash2,
  ChevronDown,
  Bookmark,
  Info,
  MessageCircle,
  Send,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { UserSession, AnalysisResult } from "./types";

interface SkinArticle {
  id: string;
  category: string;
  title: string;
  readTime: string;
  icon: string;
  summary: string;
  scienceDetail: string;
  tips: string[];
}

const SKIN_ARTICLES: SkinArticle[] = [
  {
    id: "art_1",
    category: "Acne Mechanics & Sebum",
    title: "Understanding Acne & Sebum Chemistry",
    readTime: "4 min read",
    icon: "🔬",
    summary: "Acne develops when overactive sebaceous glands produce excess sebum, merging with dead skin cells to clog hair follicles.",
    scienceDetail: "Blocked follicles create an anaerobic microenvironment perfect for Propionibacterium acnes bacteria. This triggers chemical cascades resulting in inflammatory lesions (papules/pustules) or non-inflammatory comedones (blackheads/whiteheads). Exfoliators like Salicylic Acid (BHA) are oil-soluble, allowing them to penetrate deep inside the pore lining and safely dissolve lipid blockages.",
    tips: [
      "Avoid severe physical scrubbing as it compromises your epidermal defensive shell.",
      "Incorporate Salicylic Acid (BHA) to purge sebum from deep follicular channels.",
      "Use lightweight, non-comedogenic gel hydrators to prevent pore occlusion."
    ]
  },
  {
    id: "art_2",
    category: "Skin Barrier Integrity",
    title: "The Stratum Corneum & Lipid Shield Balance",
    readTime: "3 min read",
    icon: "🛡️",
    summary: "Your skin barrier is a cellular matrix of corneocytes held together by lipid bilayers (ceramides, cholesterol, fatty acids).",
    scienceDetail: "When this barrier is corrupted (by harsh cleansers, climate, or over-exfoliation), Transepidermal Water Loss (TEWL) accelerates. This leads to dryness, redness, and extreme reactivity to safe cosmetic actives. Supplementing with physiological lipids (ceramides, phytosphingosine) actively repairs this structure, returning skin to a state of robust, calm defense.",
    tips: [
      "Cleanse only with mild, sulfate-free, pH-balanced washes.",
      "Apply humectants (Glycerin, Hyaluronic Acid) onto damp skin first.",
      "Lock in hydration with ceramide-infused creams to prevent passive moisture evaporation."
    ]
  },
  {
    id: "art_3",
    category: "Hyperpigmentation Pathways",
    title: "Melanogenesis & Fading Cellular Dark Spots",
    readTime: "5 min read",
    icon: "🎯",
    summary: "Hyperpigmentation is caused by localized overproduction of melanin within melanocyte cells, triggered by UV radiation or stress.",
    scienceDetail: "The enzyme tyrosinase catalyzes the oxidation of tyrosine into melanin. Post-inflammatory hyperpigmentation (PIH) results from inflammation stimulating melanocytes to deposit pigment into surrounding keratinocytes. Fading this requires a multi-layered approach: inhibiting tyrosinase (Alpha Arbutin, Kojic Acid, Vitamin C), blocking melanosome transfer (Niacinamide), and boosting skin cell turnover (Retinoids).",
    tips: [
      "Wear broad-spectrum SPF 50 daily to prevent UV rays from activating melanocytes.",
      "Pair Vitamin C with Niacinamide to protect against environmental oxidants and prevent dark spot formation.",
      "Incorporate chemical exfoliants (AHAs like Glycolic or Lactic Acid) to sweep pigmented cells away."
    ]
  },
  {
    id: "art_4",
    category: "Aging & Collagen Synthesis",
    title: "Collagen Preservation & Cellular Turnover Science",
    readTime: "4 min read",
    icon: "🧬",
    summary: "As we age, dermal fibroblasts slow down production of structural collagen fibers and elastin, causing sag and wrinkles.",
    scienceDetail: "Furthermore, Matrix Metalloproteinases (MMPs) break down healthy structural matrices over time. Retinoids (Vit-A derivatives) bind to nuclear receptors, turning on transcription factors that promote cellular turnover and block MMPs. This restores epidermal density, smooths tissue texturing, and actively promotes new collagen synthesis deep within the dermis.",
    tips: [
      "Apply retinoids strictly at night, as UV exposure compromises their molecular stability.",
      "Integrate copper peptides to support fibroblast repairs and accelerate healing cycles.",
      "Always apply an antioxidant-rich sunscreen during the day to block collagen-destroying free radicals."
    ]
  }
];

export default function App() {
  // Navigation views: 'signin' | 'details' | 'payment' | 'camera' | 'results' | 'journal' | 'admin' | 'whatsapp'
  const [view, setView] = useState<"signin" | "details" | "payment" | "camera" | "results" | "journal" | "admin" | "whatsapp">("signin");
  const [user, setUser] = useState<UserSession | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<string>("");

  // WhatsApp bot visual playground states
  interface WhatsAppMessage {
    id: string;
    sender: "user" | "bot" | "system";
    text: string;
    time: string;
  }
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([
    {
      id: "init_sys",
      sender: "system",
      text: "🔒 End-to-end encrypted simulated chat with GlowAI Dr. Bot (+91 62011 86100).",
      time: "Just now"
    },
    {
      id: "init_bot",
      sender: "bot",
      text: "*Namaste!* Main hu aapka GlowAI WhatsApp Assistant 🧪\n\nAap mujhse skin patterns, dry skin remedies, or products ke bare me koi bhi question bejhijhak poochh sakte hain.\n\nE.g.:\n- \"Face par dry skin ho rhi h keya lagau?\"\n- \"Mujhe boht zyada active acne or pimples hain\"\n- \"Best ingredients for dark spots reduction\"",
      time: "Just now"
    }
  ]);
  const [whatsappInput, setWhatsappInput] = useState<string>("");
  const [whatsappLoading, setWhatsappLoading] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Admin Ledger and registrations state variables
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminPending, setAdminPending] = useState<any[]>([]);
  const [adminSearch, setAdminSearch] = useState<string>("");
  const [adminSelectedCategory, setSelectedHomeCategory] = useState<string | null>(null);

  // Input forms state
  const [fullName, setFullName] = useState<string>("Rahul Kumar");
  const [uage, setUage] = useState<string>("22");
  const [concern, setConcern] = useState<string>("Acne & Breakouts");
  const [utrInput, setUtrInput] = useState<string>("");

  // Email authentication states
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [registerName, setRegisterName] = useState<string>("");
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [activeSkinFact, setActiveSkinFact] = useState<string>("general");
  const [uploadedPicture, setUploadedPicture] = useState<string>("");
  const [uploadedPictureName, setUploadedPictureName] = useState<string>("");

  // Payment delay and polling states (2-minute auto-approval or manual admin override)
  const [paymentDelayActive, setPaymentDelayActive] = useState<boolean>(false);
  const [paymentTimeLeft, setPaymentTimeLeft] = useState<number>(120);

  // Camera settings
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");

  // Scanner UI simulation features
  const [laserPosition, setLaserPosition] = useState<number>(10);
  const [hudTargetFocused, setHudTargetFocused] = useState<boolean>(false);
  const [scanningStatus, setScanningStatus] = useState<string>("Align your face inside the indicator target");

  // Analysis result
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedScanImageModal, setSelectedScanImageModal] = useState<string | null>(null);

  // Skincare Observation Journal & Face Blog state definition
  interface JournalBlog {
    id: string;
    date: string;
    title: string;
    observations: string;
    productsTried: string;
    detailedNotes: string;
  }
  
  const [blogs, setBlogs] = useState<JournalBlog[]>([]);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogObservations, setBlogObservations] = useState("");
  const [blogProducts, setBlogProducts] = useState("");
  const [blogNotes, setBlogNotes] = useState("");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  useEffect(() => {
    const email = user?.email || "guest";
    const saved = localStorage.getItem(`glowai_blogs_${email}`);
    if (saved) {
      try {
        setBlogs(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse journal blogs", err);
        setBlogs([]);
      }
    } else {
      setBlogs([]);
    }
  }, [user?.email]);

  const handleSaveBlog = () => {
    if (!blogTitle.trim()) return;
    const email = user?.email || "guest";
    const record: JournalBlog = {
      id: "blog_" + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      title: blogTitle,
      observations: blogObservations,
      productsTried: blogProducts,
      detailedNotes: blogNotes
    };
    const updated = [record, ...blogs];
    setBlogs(updated);
    localStorage.setItem(`glowai_blogs_${email}`, JSON.stringify(updated));
    
    // Clear form inputs
    setBlogTitle("");
    setBlogObservations("");
    setBlogProducts("");
    setBlogNotes("");
    setStatusMsg("Face blog note successfully saved to your clinical timeline!");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const fetchAdminRecords = (sessId: string) => {
    if (!sessId) return;
    setLoading(true);
    fetch("/api/admin/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessId })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setAdminUsers(data.users || []);
          setAdminPending(data.pending || []);
        } else {
          setErrorMsg(data.error || "Failed to load admin records");
        }
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg("Error fetching ledger records from server");
      });
  };

  const handleAdminLedgerAction = (patientEmail: string, action: "approve" | "reject") => {
    if (!sessionId) return;
    setLoading(true);
    setErrorMsg("");
    
    fetch("/api/payment/admin-override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, email: patientEmail, action }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setStatusMsg(`Successfully updated payment status for patient: ${patientEmail}`);
          setTimeout(() => setStatusMsg(""), 3000);
          fetchAdminRecords(sessionId);
        } else {
          setErrorMsg(data.error || "Override action failed");
        }
      })
      .catch((e) => {
        setLoading(false);
        setErrorMsg("Failed to dispatch override action callback");
      });
  };

  const handleCopyLink = () => {
    const shareUrl = window.location.origin || "https://ais-pre-ircpwuehdczjjtvto6qsow-649656015455.asia-southeast1.run.app";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }).catch(err => {
        fallbackCopyText(shareUrl);
      });
    } else {
      fallbackCopyText(shareUrl);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Position out of sight
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      document.body.appendChild(textArea);
      textArea.select();
      
      const successful = document.execCommand("copy");
      if (successful) {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        console.warn("execCommand copy returned false");
      }
      document.body.removeChild(textArea);
    } catch (e) {
      console.error("Fallback copy failed", e);
    }
  };

  const handleNativeShare = () => {
    const shareUrl = window.location.origin || "https://ais-pre-ircpwuehdczjjtvto6qsow-649656015455.asia-southeast1.run.app";
    if (navigator.share) {
      navigator.share({
        title: "GlowAI - AI Skincare Scanner",
        text: "Check out GlowAI! A high-tech AI Skincare analysis scanner for instant dermatologist guides and personalized chemical routines.",
        url: shareUrl,
      }).catch(err => {
        console.warn("Error sharing via native shell, falling back to copy", err);
        handleCopyLink();
      });
    } else {
      handleCopyLink();
    }
  };

  const handleDeleteBlog = (blogId: string) => {
    const email = user?.email || "guest";
    const updated = blogs.filter((b) => b.id !== blogId);
    setBlogs(updated);
    localStorage.setItem(`glowai_blogs_${email}`, JSON.stringify(updated));
  };

  const handleSendWhatsAppChat = () => {
    if (!whatsappInput.trim() || whatsappLoading || !sessionId) return;
    const userMsg = whatsappInput.trim();
    setWhatsappInput("");

    // Add user message to state
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageObj: WhatsAppMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: userMsg,
      time: now
    };
    const updatedMessages = [...whatsappMessages, userMessageObj];
    setWhatsappMessages(updatedMessages);
    setWhatsappLoading(true);

    // Call server API
    fetch("/api/whatsapp/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message: userMsg,
        history: updatedMessages
          .filter((m) => m.sender !== "system")
          .map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text
          }))
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setWhatsappLoading(false);
        if (data.reply) {
          setWhatsappMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              sender: "bot",
              text: data.reply,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        } else if (data.error) {
          setWhatsappMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              sender: "system",
              text: `⚠️ Chat Error: ${data.error}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      })
      .catch((err) => {
        setWhatsappLoading(false);
        setWhatsappMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "system",
            text: "⚠️ Network Error. Failed to connect with GlowAI Dr. Bot server.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        console.error("WhatsApp chat client dispatch error:", err);
      });
  };

  // Auto load active session from server if saved
  useEffect(() => {
    const savedSess = localStorage.getItem("glowai_sess");
    if (savedSess) {
      fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: savedSess }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setUser(data.user);
            setSessionId(savedSess);
            setFullName(data.user.name);
            setUage(String(data.user.age || "22"));
            setConcern(data.user.concern || "Acne & Breakouts");
            
            if (data.user.email === "gulshankumar9934293812@gmail.com") {
              setView("admin");
              fetchAdminRecords(savedSess);
            } else if (data.user.paymentVerified || (data.user.scansRemaining ?? 0) > 0) {
              setView("camera");
            } else {
              // Probe server status to check if a pending delay queue was alive under this session
              fetch("/api/payment/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: savedSess })
              })
                .then((r) => r.json())
                .then((statusData) => {
                  if (statusData.status === "pending") {
                    setPaymentDelayActive(true);
                    setPaymentTimeLeft(statusData.timeLeft || 120);
                  }
                })
                .catch((err) => console.log("Silent probe skipped:", err));
              setView("details");
            }
          } else {
            // Clean up stale session since it does not exist on the server
            localStorage.removeItem("glowai_sess");
            setUser(null);
            setSessionId("");
            setView("signin");
          }
        })
        .catch((e) => {
          console.error("Session restoration error", e);
          // Clean up local session on connection error/invalid state as well
          localStorage.removeItem("glowai_sess");
          setUser(null);
          setSessionId("");
          setView("signin");
        });
    }
  }, []);

  // Sync laser line scanner visualization
  useEffect(() => {
    if (view === "camera" && stream) {
      const interval = setInterval(() => {
        setLaserPosition((p) => (p >= 90 ? 10 : p + 2));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [view, stream]);

  // Polling hook for pending payments with 2-minute countdown and server state synchronization
  useEffect(() => {
    let pollerId: any = null;
    let countdownId: any = null;

    if (paymentDelayActive && sessionId) {
      // Deincrement local clock ticks every second
      countdownId = setInterval(() => {
        setPaymentTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Query verification queue updates status every 4 seconds to catch active admin approvals instantly
      pollerId = setInterval(() => {
        fetch("/api/payment/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "approved") {
              setPaymentDelayActive(false);
              setUser(data.user);
              clearInterval(pollerId);
              clearInterval(countdownId);
              setStatusMsg("Transaction successfully validated with Ledger! Scanner analysis unlocked.");
              setTimeout(() => {
                setStatusMsg("");
                startCameraStream();
                setView("camera");
              }, 1200);
            } else if (data.status === "pending") {
              if (data.timeLeft !== undefined) {
                setPaymentTimeLeft(data.timeLeft);
              }
            }
          })
          .catch((e) => console.log("Reconciliation poll delay passive:", e));
      }, 4000);
    }

    return () => {
      if (pollerId) clearInterval(pollerId);
      if (countdownId) clearInterval(countdownId);
    };
  }, [paymentDelayActive, sessionId]);

  // Polling hook for administrator to automatically sync register and pending queues in real-time
  useEffect(() => {
    let adminPollerId: any = null;
    if (view === "admin" && sessionId) {
      // Poll server status every 6 seconds to show registration ledger dynamics list
      adminPollerId = setInterval(() => {
        fetchAdminRecords(sessionId);
      }, 6000);
    }
    return () => {
      if (adminPollerId) clearInterval(adminPollerId);
    };
  }, [view, sessionId]);

  // Manual simulator: Bypasses queue instantly to simulate active admin intervention
  const handleAdminSimulateApproval = () => {
    if (!sessionId) return;
    setLoading(true);
    setErrorMsg("");
    
    fetch("/api/payment/admin-override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, action: "approve" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setPaymentDelayActive(false);
          setUser(data.user);
          setStatusMsg("Admin available override: Account approved instantly!");
          setTimeout(() => {
            setStatusMsg("");
            startCameraStream();
            setView("camera");
          }, 1200);
        } else {
          setErrorMsg(data.error || "Override error");
        }
      })
      .catch((e) => {
        setLoading(false);
        setErrorMsg("Communication error with manual verification bridge");
      });
  };

  // Handle Google Sign-in Sandbox
  const handleGoogleSignInByPass = () => {
    setLoading(true);
    setErrorMsg("");
    
    // Simulate query for email/payload
    const mockEmail = "gulshankumar9934293812@gmail.com";
    const mockName = "Gulshan Kumar";
    const mockPic = "https://api.dicebear.com/7.x/adventurer/svg?seed=Gulshan";

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mockEmail, name: mockName, picture: mockPic }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setUser(data.user);
          setSessionId(data.sessionId);
          setFullName(data.user.name);
          if (data.user.age) setUage(String(data.user.age));
          if (data.user.concern) setConcern(data.user.concern);
          localStorage.setItem("glowai_sess", data.sessionId);
          
          if (data.user.email === "gulshankumar9934293812@gmail.com") {
            setView("admin");
            fetchAdminRecords(data.sessionId);
          } else if (data.user.paymentVerified || (data.user.scansRemaining ?? 0) > 0) {
            startCameraStream();
            setView("camera");
          } else {
            setView("details");
          }
        } else {
          setErrorMsg(data.error || "Authentication error");
        }
      })
      .catch((e) => {
        setLoading(false);
        setErrorMsg("Failed to connect to GlowAI server backend");
      });
  };

  // Handle Photo Upload Conversion
  const handlePhotoFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg("Photo size is too large. Please select an image under 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUploadedPicture(reader.result);
          setUploadedPictureName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Email Registration
  const handleEmailSignUp = (e: FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput || !registerName) {
      setErrorMsg("Please fill in Name, Email and Password");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: emailInput, 
        password: passwordInput, 
        name: registerName, 
        picture: uploadedPicture || undefined 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setUser(data.user);
          setSessionId(data.sessionId);
          setFullName(data.user.name);
          localStorage.setItem("glowai_sess", data.sessionId);
          setView("details");
        } else {
          setErrorMsg(data.error || "Registration failed");
        }
      })
      .catch((e) => {
        setLoading(false);
        setErrorMsg("Failed to connect to GlowAI server backend");
      });
  };

  // Handle Email Login/Verification
  const handleEmailLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setErrorMsg("Please enter both Email and Password");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    fetch("/api/auth/email-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setUser(data.user);
          setSessionId(data.sessionId);
          setFullName(data.user.name);
          if (data.user.age) setUage(String(data.user.age));
          if (data.user.concern) setConcern(data.user.concern);
          localStorage.setItem("glowai_sess", data.sessionId);
          
          if (data.user.email === "gulshankumar9934293812@gmail.com") {
            setView("admin");
            fetchAdminRecords(data.sessionId);
          } else if (data.user.paymentVerified || (data.user.scansRemaining ?? 0) > 0) {
            startCameraStream();
            setView("camera");
          } else {
            setView("details");
          }
        } else {
          setErrorMsg(data.error || "Login fail. Please check credentials.");
        }
      })
      .catch((e) => {
        setLoading(false);
        setErrorMsg("Failed to connect to GlowAI server backend");
      });
  };

  // Submit profile details
  const handleDetailsForm = (e: FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      setErrorMsg("Please sign in first");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    fetch("/api/auth/save-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        name: fullName,
        age: uage,
        concern,
        picture: uploadedPicture || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setUser(data.user);
          // If already paid or has free scans remaining, go straight to camera, else to payment
          if (data.user.paymentVerified || (data.user.scansRemaining ?? 0) > 0) {
            startCameraStream();
            setView("camera");
          } else {
            setView("payment");
          }
        } else {
          setErrorMsg(data.error || "Could not save details");
        }
      })
      .catch((e) => {
        setLoading(false);
        setErrorMsg("Error communicating with server");
      });
  };

  // Verify UTR Payment Form
  const handleVerifyPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      setErrorMsg("Unauthorized session");
      return;
    }

    if (!utrInput || !/^\d{12}$/.test(utrInput)) {
      setErrorMsg("Incorrect format. UTR number must be exactly 12 numeric digits.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, utr: utrInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          if (data.status === "pending") {
            // Active hours detected! Enable countdown timer screen
            setPaymentDelayActive(true);
            setPaymentTimeLeft(data.timeLeft || 120);
            setStatusMsg("Transaction logged. Active clinical review hours detected: 2-minute verification queue active.");
            setTimeout(() => setStatusMsg(""), 4000);
          } else {
            // Direct instantaneous off-hours pass
            setUser(data.user);
            setStatusMsg("Payment successfully processed! Professional scanner unlocked.");
            setTimeout(() => {
              setStatusMsg("");
              startCameraStream();
              setView("camera");
            }, 1200);
          }
        } else {
          setErrorMsg(data.error || "Verification failed");
        }
      })
      .catch((e) => {
        setLoading(false);
        setErrorMsg("Network error occurred during automated ledger reconciliation");
      });
  };

  // Helper to instantly load pre-paid credentials for reviewers
  const handleBypassPayment = () => {
    setUtrInput("123456789012");
  };

  // Initialize camera streams
  const startCameraStream = () => {
    setCameraError("");
    setScanningStatus("Initializing professional high-res capture lens...");
    
    // Safety guard for sandboxed iframes or insecure preview origins missing host mediaDevices mapping
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera capture APIs are not supported on this device/browser setup, or are blocked by the iframe constraints. GlowAI needs secure origin (HTTPS/localhost) and iframe permission flags to stream real-time face snapshots.");
      setScanningStatus("GlowAI engine suspended.");
      return;
    }

    // Explicit camera access triggers
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: "user",
        width: { ideal: 1024 },
        height: { ideal: 768 }
      } 
    })
      .then((s) => {
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setScanningStatus("Face Alignment Guide active: Match target zone properly.");
        setHudTargetFocused(true);
      })
      .catch((err) => {
        console.error("Camera access failed", err);
        setCameraError("Camera access denied or device is not present. GlowAI needs a front-facing lens for dermatological evaluation.");
        setScanningStatus("Waiting for system permission check...");
      });
  };

  // Stop camera media tracks safely
  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setHudTargetFocused(false);
  };

  // Camera scanning triggers
  const handleCaptureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setErrorMsg("Visual engine not initialized correctly");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setStatusMsg("Capturing micro-surface high-resolution dermatological snapshot...");

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Unable to create canvas 2D render pipeline context");
      }

      // Draw high resolution image from streaming video source
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Add stylistic futuristic glow to snapshot if desired, then export to server
      const base64Data = canvas.toDataURL("image/jpeg", 0.9).split(",")[1];

      setStatusMsg("Running multi-spectral epidermal assessment and texture indexing...");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, base64Image: base64Data }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          // Stale session detected, reset local credentials and redirect
          localStorage.removeItem("glowai_sess");
          setUser(null);
          setSessionId("");
          setView("signin");
        }
        throw new Error(responseData.error || "Epidermal model analysis failed");
      }

      setStatusMsg("Compiling clinically correlated routine & metric summaries...");
      setAnalysisResult(responseData.analysis);
      
      if (responseData.user) {
        setUser(responseData.user);
      }
      
      // Complete scanner processing, go to analysis suite view
      setTimeout(() => {
        setLoading(false);
        setStatusMsg("");
        stopCameraStream();
        setView("results");
      }, 100);

    } catch (err: any) {
      setLoading(false);
      setStatusMsg("");
      setErrorMsg(err.message || "Visual analysis engine encountered a validation conflict.");
    }
  };

  const handleResetSession = () => {
    stopCameraStream();
    setAnalysisResult(null);
    if (user && user.paymentVerified) {
      // Keep verified user, just scan again
      startCameraStream();
      setView("camera");
    } else {
      setView("details");
    }
  };

  const handleFullLogout = () => {
    stopCameraStream();
    setUser(null);
    setSessionId("");
    setAnalysisResult(null);
    localStorage.removeItem("glowai_sess");
    setView("signin");
  };

  // Print recommendation summary report helper
  const handlePrintReport = () => {
    window.print();
  };

  // Format seconds to clock MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div id="glowai-app-root" className="min-h-screen bg-[#FBFDFE] flex flex-col font-sans text-slate-800">
      
      {/* ELABORATE HEADER FOR BOTH GUESTS & LOGGED IN PATIENTS */}
      <nav id="landing-navbar" className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 md:px-12 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/15 shrink-0">
            <Sparkles className="w-5 h-5 text-white active-target" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none animate-pulse/25">
              Glow<span className="text-teal-600 font-extrabold text-2xl">AI</span>
            </h1>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold mt-0.5 block">Dermatological Portal</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-extrabold text-slate-500 uppercase tracking-widest">
          <button 
            type="button"
            onClick={() => {
              stopCameraStream();
              if (user) {
                if (user.email === "gulshankumar9934293812@gmail.com") {
                  setView("admin");
                } else if (user.paymentVerified) {
                  setView("camera");
                } else {
                  setView("details");
                }
              } else {
                setView("signin");
                setSelectedHomeCategory(null);
              }
            }}
            className="hover:text-teal-600 transition flex items-center gap-2 cursor-pointer bg-transparent border-0 outline-none"
          >
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Home Lobby</span>
          </button>
          
          <a href="#clinical-categories" className="hover:text-teal-600 transition flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Skin Categories</span>
          </a>

          <a href="#app-info" className="hover:text-teal-600 transition flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span>App Mechanics</span>
          </a>

          <a 
            href="https://api.whatsapp.com/send?phone=916201186100" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-600 text-slate-450 transition flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-emerald-500" />
            <span>Support Chat</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-black text-slate-800 leading-none block">{user.name}</span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{user.email}</span>
              </div>
              <button 
                onClick={handleFullLogout}
                className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-extrabold transition cursor-pointer font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                setView("signin");
                setTimeout(() => {
                  const element = document.getElementById("view-signin");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }, 100);
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition shadow-md shadow-teal-650/10 cursor-pointer"
            >
              Start Scan
            </button>
          )}
        </div>
      </nav>

      {/* MULTI-COLUMN CONTAINER WRAPPER */}
      <div className="flex flex-1 min-h-0 bg-[#F8FAFC]">
        
        {/* SIDEBAR FOR PATIENTS (Only shown if logged in and not admin!) */}
        {user && user.email !== "gulshankumar9934293812@gmail.com" && (
          <aside className="hidden lg:flex w-80 bg-white border-r border-[#E2E8F0] flex-col shrink-0">
            
            {/* Session Indicator badge */}
            <div className="p-6 border-b border-[#F1F5F9]">
              <span className="bg-teal-50 text-teal-800 border border-teal-100 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-xl block text-center mb-4">
                📋 ACTIVE CLINICAL SESSION
              </span>
              
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-md">
                  <div className="w-3.5 h-3.5 bg-white rounded-full pulse-target"></div>
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
                    Glow<span className="text-teal-600 font-extrabold text-2.5xl">AI</span>
                  </h1>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-1">Dermatological Intelligence</p>
                </div>
              </div>
            </div>

            {/* Diagnostic Metadata & Patient Record Information */}
            <div className="p-5 space-y-5 flex-1 overflow-y-auto">
              
              {/* NAVIGATION SUITE */}
              <div className="space-y-1.5 pb-4 border-b border-[#F1F5F9]">
                <p className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-widest px-1 mb-2">Navigation Suite</p>
                
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setView("details");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    view === "details"
                      ? "bg-slate-900 text-white shadow-md shadow-slate-950/10"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>Patient Profile Setup</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (user.paymentVerified || (user.scansRemaining ?? 0) > 0) {
                      startCameraStream();
                      setView("camera");
                    } else {
                      setView("payment");
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    view === "camera" || view === "payment"
                      ? "bg-slate-900 text-white shadow-md shadow-slate-950/10"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Camera className="w-4 h-4 shrink-0" />
                    <span>3D Face AI Scanner</span>
                  </div>
                  {!(user.paymentVerified || (user.scansRemaining ?? 0) > 0) ? (
                    <span className="text-[8px] bg-amber-105 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-90 shrink-0">🔐 Pay ₹15</span>
                  ) : (user.scansRemaining ?? 0) > 0 && !user.paymentVerified ? (
                    <span className="text-[8px] bg-teal-50 text-teal-850 font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-90 shrink-0">🎁 Free ({user.scansRemaining})</span>
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (analysisResult) {
                      stopCameraStream();
                      setView("results");
                    }
                  }}
                  disabled={!analysisResult}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    !analysisResult 
                      ? "opacity-35 cursor-not-allowed text-slate-400" 
                      : view === "results"
                        ? "bg-slate-900 text-white shadow-md shadow-slate-950/10"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 shrink-0" />
                    <span>Diagnostic Skin Report</span>
                  </div>
                  {!analysisResult && (
                    <span className="text-[8px] font-mono text-slate-450 uppercase tracking-wider shrink-0 bg-slate-105 px-1 rounded">Locked</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setView("journal");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    view === "journal"
                      ? "bg-slate-900 text-white shadow-md shadow-slate-950/10"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>Skin Journal & Face Blog</span>
                  </div>
                  <span className="text-[9px] bg-teal-50 text-teal-700 font-extrabold px-1.5 py-0.5 rounded-md font-mono shrink-0">{blogs.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setView("whatsapp");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    view === "whatsapp"
                      ? "bg-slate-900 text-white shadow-md shadow-slate-950/10"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>WhatsApp doctor Bot</span>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Patient Record Profile</p>
                <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/60 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-slate-200 shrink-0">
                      <img src={user.picture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} alt="Profile" className="w-full h-full" />
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-black text-slate-900 truncate">{user.name}</h5>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase tracking-wider text-[9px] font-extrabold">Age Limit:</span>
                      <span className="font-bold text-slate-705">{user.age || uage || "Unassigned"} yrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase tracking-wider text-[9px] font-extrabold">Primary Target:</span>
                      <span className="font-bold text-teal-650 truncate max-w-[120px]">{user.concern || concern}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-450 uppercase tracking-wider text-[9px] font-extrabold">Billing Status:</span>
                      {user.paymentVerified ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full text-[9px] border border-emerald-100">
                          <CheckCircle className="w-2.5 h-2.5" /> Paid Active
                        </span>
                      ) : (user.scansRemaining ?? 0) > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 font-extrabold px-2 py-0.5 rounded-full text-[9px] border border-teal-100">
                          🎁 Free Trial ({user.scansRemaining} scans)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded-full text-[9px] border border-amber-100">
                          Trial Expired (Pay ₹15)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Diagnostic Engine Status</p>
                <div className="px-4 py-3 bg-teal-50/60 border border-teal-100 rounded-2xl flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.6)] shrink-0"></div>
                  <div className="text-[11px]">
                    <span className="font-bold text-teal-800 block">AI Core: Online</span>
                    <span className="text-[10px] text-teal-605 font-medium">Model: Gemini-3.5-Flash</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Scanner Technology Features</p>
                <div className="space-y-2 text-[11px] text-slate-650 bg-white p-4 rounded-xl border border-slate-100">
                  <p className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✔</span>
                    <span><strong>Multi-spectral Indexing:</strong> Scans sebum, elasticity, and pore health via vision modeling.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✔</span>
                    <span><strong>Real-time HUD Graphics:</strong> Trackers visually pinpoint key concern areas accurately.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✔</span>
                    <span><strong>UPI Auto-Validation:</strong> Quick, friction-free QR scanning & instant 12-digit verification.</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Logout Footer Section */}
            <div className="p-6 border-t border-[#F1F5F9]">
              <button 
                onClick={handleFullLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-all duration-200 text-sm font-bold"
              >
                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>Session Log Out</span>
              </button>
            </div>
          </aside>
        )}

        {/* MAIN LAYOUT CANVAS CONTAINER */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* TOP COMPONENT HEADER: ACTION BAR */}
          {user && (
            <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                  {user.email === "gulshankumar9934293812@gmail.com" ? "🔒 Administrator Ledger & Control Board" : "✨ Patient Scanner Lobby"}
                </h2>
              </div>

              <div className="flex gap-2.5 items-center">
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250/60 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share App</span>
                </button>

                {view === "results" && (
                  <button 
                    onClick={handlePrintReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-705 rounded-lg text-xs font-bold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Report</span>
                  </button>
                )}

                {user.email !== "gulshankumar9934293812@gmail.com" && (
                  <button 
                    onClick={handleResetSession}
                    className="px-3 border border-teal-200 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-extrabold transition"
                  >
                    {analysisResult ? "New Scan" : "Scanner Hub"}
                  </button>
                )}

                {user.email === "gulshankumar9934293812@gmail.com" && (
                  <button 
                    onClick={() => fetchAdminRecords(sessionId)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-extrabold transition"
                  >
                    Reload Ledger Logs
                  </button>
                )}
              </div>
            </header>
          )}

          {/* MOBILE RESPONSIVE NAVIGATION TABS */}
          {user && user.email !== "gulshankumar9934293812@gmail.com" && (
            <nav className="lg:hidden bg-white border-b border-[#E2E8F0] px-6 py-2.5 flex justify-around gap-1 overflow-x-auto shrink-0 select-none shadow-sm shadow-slate-100">
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setView("details");
                }}
                className={`flex flex-col items-center gap-1.5 px-3 py-1 bg-transparent border-0 outline-none transition cursor-pointer ${
                  view === "details" ? "text-teal-600 font-extrabold scale-105" : "text-slate-550 hover:text-slate-850"
                }`}
              >
                <User className="w-4 h-4 text-slate-455" />
                <span className="text-[10px] tracking-tight font-sans font-bold">Setup</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (user.paymentVerified || (user.scansRemaining ?? 0) > 0) {
                    startCameraStream();
                    setView("camera");
                  } else {
                    setView("payment");
                  }
                }}
                className={`flex flex-col items-center gap-1.5 px-3 py-1 bg-transparent border-0 outline-none transition cursor-pointer ${
                  view === "camera" || view === "payment" ? "text-teal-600 font-extrabold scale-105" : "text-slate-550 hover:text-slate-850"
                }`}
              >
                <Camera className="w-4 h-4 text-slate-455" />
                <span className="text-[10px] tracking-tight font-sans font-bold">AI Scan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (analysisResult) {
                    stopCameraStream();
                    setView("results");
                  }
                }}
                disabled={!analysisResult}
                className={`flex flex-col items-center gap-1.5 px-3 py-1 bg-transparent border-0 outline-none transition cursor-pointer disabled:opacity-30 ${
                  view === "results" ? "text-teal-600 font-extrabold scale-105" : "text-slate-550"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-[10px] tracking-tight font-sans font-bold">Report</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setView("journal");
                }}
                className={`flex flex-col items-center gap-1.5 px-3 py-1 bg-transparent border-0 outline-none transition cursor-pointer ${
                  view === "journal" ? "text-teal-600 font-extrabold scale-105" : "text-slate-550 hover:text-slate-855"
                }`}
              >
                <BookOpen className="w-4 h-4 text-slate-455" />
                <span className="text-[10px] tracking-tight font-sans font-bold">Face Blog</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setView("whatsapp");
                }}
                className={`flex flex-col items-center gap-1.5 px-3 py-1 bg-transparent border-0 outline-none transition cursor-pointer ${
                  view === "whatsapp" ? "text-teal-600 font-extrabold scale-105" : "text-slate-550 hover:text-slate-855"
                }`}
              >
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <span className="text-[10px] tracking-tight font-sans font-bold text-slate-600">Dr. Bot</span>
              </button>

              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex flex-col items-center gap-1.5 px-3 py-1 bg-transparent/0 border-0 outline-none transition cursor-pointer text-slate-550 hover:text-slate-855"
              >
                <Share2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-[10px] tracking-tight font-sans font-bold text-emerald-700">Share</span>
              </button>
            </nav>
          )}

          {/* DYNAMIC PROGRESS INJECTOR STATE ALERTS */}
          {errorMsg && (
            <div className="mx-6 md:mx-8 mt-6 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-2xl flex items-start gap-3 animate-fadeIn">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block text-rose-800">Operational Notice:</span>
                <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
              <button onClick={() => setErrorMsg("")} className="ml-auto text-rose-450 hover:text-rose-800 font-bold text-sm">×</button>
            </div>
          )}

          {statusMsg && (
            <div className="mx-6 md:mx-8 mt-6 bg-teal-50 border border-teal-200 text-teal-800 px-5 py-3.5 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <Loader2 className="w-5 h-5 animate-spin text-teal-600 shrink-0" />
              <div className="text-xs font-bold font-mono tracking-tight text-teal-800">
                {statusMsg}
              </div>
            </div>
          )}

          {/* WORKSPACE APP PANELS */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center items-center">
            
            <div className="w-full max-w-4xl">
            
            {/* VIEW 1: PRE-AUTHENTICATION / SIGN-IN */}
            {view === "signin" && (
              <div id="view-signin" className="w-full max-w-5xl mx-auto bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-[0_15px_60px_rgba(0,0,0,0.04)] p-6 md:p-10 relative overflow-hidden transition-all duration-300 animate-fadeIn text-slate-800">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-500"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                  
                  {/* LEFT COLUMN: MULTI-SPECTRAL SKIN SCIENCE & APP INFORMATION */}
                  <div className="lg:col-span-7 flex flex-col justify-between pr-0 lg:pr-6 border-r-0 lg:border-r border-slate-100 text-left">
                    <div>
                      <div className="flex items-center gap-3.5 mb-6">
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center shadow-xs">
                          <Sparkles className="w-6 h-6 text-teal-600" />
                        </div>
                         <div className="flex-1">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <span className="bg-teal-50 text-teal-850 text-[10px] uppercase tracking-[0.2em] font-extrabold px-3 py-1 rounded-full border border-teal-100">
                              Clinical AI Diagnostics
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowShareModal(true)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:border-emerald-300 border border-emerald-200 rounded-full text-[10px] font-black tracking-wider uppercase transition cursor-pointer outline-none shrink-0"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Share web</span>
                            </button>
                          </div>
                          <h2 className="text-2xl font-black text-slate-850 tracking-tight mt-1 leading-tight">
                            Glow<span className="text-teal-600">AI</span> Skin Engine & Portal
                          </h2>
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed mb-8">
                        GlowAI analyzes multi-resolution epidermal images via advanced light-spectrum simulations. It automatically assesses Redness, Pores, Hydration, and Active Acne lesions to formulate custom, biocompatible active chemical serums tailored precisely to your diagnostic scan.
                      </p>

                      {/* SKIN MECHANICS EXPLORER */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                          Epidermal Mechanics & Skin Chemistry
                        </h3>

                        <div className="flex gap-2 flex-wrap mb-4">
                          {[
                            { id: "general", label: "💡 GlowAI Features" },
                            { id: "dry", label: "💧 Dry/Dehydrated" },
                            { id: "acne", label: "🔬 Acne & Sebum" },
                            { id: "redness", label: "🌿 Redness/Sensitive" }
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveSkinFact(tab.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 cursor-pointer ${
                                activeSkinFact === tab.id
                                  ? "bg-slate-900 text-white shadow-xs"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-650"
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Interactive Content Area */}
                        <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl min-h-[190px] flex flex-col justify-between transition-all duration-300">
                          {activeSkinFact === "general" && (
                            <div className="space-y-3 animate-fadeIn">
                              <h4 className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">How the GlowAI Scanner Works</h4>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Our platform simulates dermatological multi-spectral lighting. It measures depth index, light diffusion properties of melanin layers, micro-vascular blood perfusion (redness), and sebum lipid reflectivity.
                              </p>
                              <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500">
                                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-teal-500" /> UV Spot Index</div>
                                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-teal-500" /> Sebum Reflection</div>
                                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-teal-500" /> Hydration Curve</div>
                                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-teal-500" /> Erythema Assay</div>
                              </div>
                            </div>
                          )}

                          {activeSkinFact === "dry" && (
                            <div className="space-y-3 animate-fadeIn">
                              <h4 className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">Dry & Dehydrated Barrier Science</h4>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Dry skin stems from missing lipids in the stratum corneum, accelerating transepidermal water loss (TEWL). Skin feels tight, rough, and shows premature fine lines.
                              </p>
                              <p className="text-xs text-slate-500 italic">
                                <strong className="text-slate-700">Therapeutic Strategy:</strong> Support with multi-molecular weight Hyaluronic Acid to trap water, paired with Ceramides NP/AP and Squalane to lock in hydration.
                              </p>
                            </div>
                          )}

                          {activeSkinFact === "acne" && (
                            <div className="space-y-3 animate-fadeIn">
                              <h4 className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">Acne Mechanics & Sebum Saturation</h4>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Overactive sebaceous glands produce heavy squalene lipids. Combined with poor keratinocyte shedding, pores clog, breeding anaerobic C. acnes bacteria and provoking painful inflammatory immune responses.
                              </p>
                              <p className="text-xs text-slate-500 italic">
                                <strong className="text-slate-700">Therapeutic Strategy:</strong> Utilize lipophilic Salicylic Acid (BHA 2%) to dissolve intracellular cement in pores, combined with Niacinamide (5%) to control sebum.
                              </p>
                            </div>
                          )}

                          {activeSkinFact === "redness" && (
                            <div className="space-y-3 animate-fadeIn">
                              <h4 className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">Sensitive Skin & Erythema Mechanics</h4>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                A compromised acid mantle allows irritants to touch sensory nerve endings direct, causing microvascular flushing (erythema) and cytokine release (chronic low-grade redness).
                              </p>
                              <p className="text-xs text-slate-500 italic">
                                <strong className="text-slate-700">Therapeutic Strategy:</strong> Avoid harsh alcohols and physical scrubs. Repair with Centella Asiatica (Cica), Panthenol (B5), and soothing Mugwort extract.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Left footer: trust badge */}
                    <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-6 text-slate-400 text-[10px] font-mono tracking-widest uppercase">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>HIPAA SAFE</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                        <span>CLINICAL AI</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: PREMIUM DUAL SIGN-IN FORM */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="border border-slate-200 bg-white rounded-3xl p-6 md:p-10 space-y-8 text-left shadow-lg shadow-slate-100">
                      
                      {/* Form Header */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                            {isSigningUp ? "Create Profile" : "Secure Log In"}
                          </h2>
                          <button 
                            type="button"
                            onClick={() => {
                              setIsSigningUp(!isSigningUp);
                              setErrorMsg("");
                            }}
                            className="text-xs font-black text-teal-600 hover:text-teal-700 underline focus:outline-none cursor-pointer"
                          >
                            {isSigningUp ? "Have an account? Login" : "New Account?"}
                          </button>
                        </div>
                        <p className="text-slate-450 text-xs md:text-sm">
                          {isSigningUp 
                            ? "Register your clinical patient dossier details to initiate advanced epidermal vision assessments." 
                            : "Enter your registered credentials to access your dynamic clinical reports."
                          }
                        </p>
                      </div>

                      {/* Ordinary email forms */}
                      <div>
                        <form onSubmit={isSigningUp ? handleEmailSignUp : handleEmailLogin} className="space-y-5">
                          {isSigningUp && (
                            <div className="space-y-1.5">
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-widest">
                                Patient Full Name
                              </label>
                              <div className="relative">
                                <input 
                                  type="text"
                                  placeholder="e.g. Rahul Kumar"
                                  required
                                  value={registerName}
                                  onChange={(e) => setRegisterName(e.target.value)}
                                  className="block w-full p-4 pl-12 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl transition-all outline-none text-sm md:text-base font-bold text-slate-850 placeholder-slate-400"
                                />
                                <User className="absolute left-4 top-[18px] w-4.5 h-4.5 text-slate-400" />
                              </div>
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-widest">
                              Email Address
                            </label>
                            <div className="relative">
                              <input 
                                type="email"
                                placeholder="e.g. name@example.com"
                                required
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="block w-full p-4 pl-12 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl transition-all outline-none text-sm md:text-base font-bold text-slate-850 placeholder-slate-400"
                              />
                              <Bookmark className="absolute left-4 top-[18px] w-4.5 h-4.5 text-slate-400" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-widest">
                              Security Password
                            </label>
                            <div className="relative">
                              <input 
                                type="password"
                                placeholder="••••••••"
                                required
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="block w-full p-4 pl-12 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl transition-all outline-none text-sm md:text-base font-bold text-slate-855 placeholder-slate-400"
                              />
                              <Info className="absolute left-4 top-[18px] w-4.5 h-4.5 text-slate-400" />
                            </div>
                          </div>

                          {/* Profile Photo Upload Field (Shown on Signup) */}
                          {isSigningUp && (
                            <div className="space-y-2">
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-widest">
                                Profile Photo (Upload optional)
                              </label>
                              <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                                <div className="w-14 h-14 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                                  {uploadedPicture ? (
                                    <img src={uploadedPicture} alt="Profile Preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <Camera className="w-6 h-6 text-slate-450" />
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <label className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black px-4 py-2 rounded-xl cursor-pointer shadow-xs uppercase tracking-wider transition">
                                    Choose Photo
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      onChange={handlePhotoFileChange} 
                                      className="hidden" 
                                    />
                                  </label>
                                  <p className="text-[11px] text-slate-450 mt-1 truncate max-w-[180px]">
                                    {uploadedPictureName ? uploadedPictureName : "Upload skin photo / selfie"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 rounded-2xl text-sm uppercase tracking-wider transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg hover:shadow-slate-900/10"
                          >
                            {loading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : isSigningUp ? (
                              <span>Register & Start Analysis</span>
                            ) : (
                              <span>Sign In Securely</span>
                            )}
                          </button>
                        </form>

                        {/* Hinglish Information Card - explaining what the app does */}
                        <div id="hinglish-info-card" className="mt-6 p-5 bg-gradient-to-r from-teal-50/60 to-emerald-50/60 border border-teal-150/80 rounded-2xl text-left shadow-xs">
                          <span className="text-[10px] uppercase font-black tracking-widest text-teal-800 bg-teal-150/50 px-2.5 py-1 rounded-md inline-block mb-2">🔥 Yeh App Kya Karta Hai?</span>
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                            <strong>GlowAI Skin Scanner</strong> aapke chehre ka <strong>live scan</strong> karke aapka exact <strong>Skin Type (Dry, Oily ya Sensitive)</strong> batata hai, aur pores ya breakouts ke hisab se <strong>perfect dynamic morning aur night routine</strong> tyar karta hai!
                          </p>
                          <p className="text-[10px] text-slate-550 leading-relaxed mt-2.5 border-t border-teal-100/60 pt-2.5">
                            👉 Agar aap naye user hain, toh <strong>Register</strong> karke profile photo upload karein aur scan karein. Agar already registered hain, toh login karein.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Aesthetic clinical notes */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-6 text-slate-450 text-[11px] font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                    <span>99.2% Prediction Concordance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-teal-500 rounded-full"></span>
                    <span>Secure End-to-End Sessions</span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: PROFILE DETAILS PATIENT FORM */}
            {view === "details" && (
              <div id="view-details" className="w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-[0_8px_35px_rgba(0,0,0,0.02)]">
                <div className="border-b border-slate-100 pb-6 mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2.5xl font-black text-slate-900 tracking-tight">Complete Skincare Dossier</h2>
                    <p className="text-slate-400 text-xs mt-1">Provide background information so the vision model can accurately contextualize dermal anomalies.</p>
                  </div>
                  <span className="hidden sm:inline-flex bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-wider">
                    Step 1 of 2
                  </span>
                </div>

                <form id="details-form" onSubmit={handleDetailsForm} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-2.5">Patient Full Name</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Rahul Kumar" 
                          required 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="block w-full p-4 pl-11 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-slate-800 text-sm font-semibold"
                        />
                        <User className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-2.5">Age Criterion</label>
                      <input 
                        type="number" 
                        placeholder="22" 
                        required 
                        min="1"
                        max="120"
                        value={uage}
                        onChange={(e) => setUage(e.target.value)}
                        className="block w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-slate-800 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-2.5">Primary Skin Concern</label>
                    <div className="relative">
                      <select 
                        value={concern}
                        onChange={(e) => setConcern(e.target.value)}
                        className="block w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none outline-none cursor-pointer text-slate-800 text-sm font-semibold"
                      >
                        <option value="Acne & Breakouts">Acne & Active Breakouts (Inflammatory/Hormonal)</option>
                        <option value="Dark Spots & Pigmentation">Dark Spots, Sun Damage & Hyperpigmentation</option>
                        <option value="Wrinkles & Anti-aging">Fine Lines, Wrinkles & Skin Laxity</option>
                        <option value="Dryness & Flakiness">Extreme Dryness, Flaky Patches & Skin Flaccidity</option>
                        <option value="General Skin Analysis">General Skin Quality Indexing & Preventive Care</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Selecting a matching concern alters how Gemini assigns routine active ingredients.</p>
                  </div>

                  {/* Profile Photo Upload inside Complete Skincare Dossier */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-widest">
                      Update Profile Photo (Optional)
                    </label>
                    <div className="flex items-center gap-5 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                      <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                        {uploadedPicture ? (
                          <img src={uploadedPicture} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : user?.picture ? (
                          <img src={user.picture} alt="Current Profile" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-7 h-7 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <label className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black px-4 py-2.5 rounded-xl cursor-pointer shadow-xs uppercase tracking-wider transition">
                          Upload New Photo
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handlePhotoFileChange} 
                            className="hidden" 
                          />
                        </label>
                        <p className="text-xs text-slate-450 mt-1.5 truncate max-w-[240px]">
                          {uploadedPictureName ? uploadedPictureName : "Choose a skin snapshot or selfie file"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold py-4.5 rounded-2xl hover:shadow-lg hover:shadow-teal-600/20 transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
                    >
                      <span>Proceed to Diagnostic Licensing</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 3: PAYMENT / UNLOCK UPI QR */}
            {view === "payment" && (
              paymentDelayActive ? (
                <div id="view-payment-delay" className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-11 shadow-[0_12px_45px_rgba(0,0,0,0.03)] text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 animate-pulse"></div>
                  
                  <div className="flex justify-center mb-4">
                    <span className="bg-teal-50 text-teal-800 border border-teal-100 text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-extrabold flex items-center gap-1.5 animate-pulse">
                      <Clock className="w-3 h-3 text-teal-600" /> ⏳ Awaiting Ledger Verification
                    </span>
                  </div>

                  <h2 className="text-2.5xl font-black text-slate-900 tracking-tight mt-1 mb-2">Verification Queue Active</h2>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto mb-8">
                    Your UTR reference <strong className="font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-800 font-bold">{utrInput}</strong> is logged. Active reconciliation is underway.
                  </p>

                  {/* Circular visual timer */}
                  <div className="w-40 h-40 rounded-full border-4 border-slate-100 flex flex-col items-center justify-center mx-auto mb-8 bg-slate-50/50 shadow-inner relative">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Auto-Approve</span>
                    <span className="text-3.5xl font-black text-slate-800 font-mono tracking-tighter mt-1">{formatTime(paymentTimeLeft)}</span>
                    <span className="text-[9px] text-teal-650 font-extrabold mt-1 uppercase tracking-wider animate-pulse">Live Polling</span>
                    <div className="absolute inset-0 rounded-full border-2 border-teal-500 border-t-transparent animate-spin opacity-40"></div>
                  </div>

                  {/* Staggered detailed log indicators */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left mb-8 space-y-4">
                    <div className="flex gap-3 items-start">
                      <span className="w-4.5 h-4.5 bg-emerald-500 text-white flex items-center justify-center rounded-full text-[9px] font-black shrink-0 mt-0.5">✓</span>
                      <div>
                        <strong className="text-xs text-slate-800 block">Ledger Code Recorded</strong>
                        <span className="text-[11px] text-slate-500 leading-normal block mt-0.5">Transaction logged with token: <span className="font-mono bg-slate-200/50 px-1 py-0.5 rounded text-[10px]">{sessionId ? sessionId.substring(0, 10) + "..." : "Sess"}</span></span>
                      </div>
                    </div>
                    
                    <div className="border-l border-dashed border-slate-200 ml-2 h-2.5"></div>

                    <div className="flex gap-3 items-start">
                      <span className="w-4.5 h-4.5 bg-emerald-500 text-white flex items-center justify-center rounded-full text-[9px] font-black shrink-0 mt-0.5">✓</span>
                      <div>
                        <strong className="text-xs text-slate-800 block">Admin Dispatch Sent</strong>
                        <span className="text-[11px] text-slate-500 leading-normal block mt-0.5">Patient profile demographics & UTR transmitted to WhatsApp (+916201186100).</span>
                      </div>
                    </div>

                    <div className="border-l border-dashed border-slate-200 ml-2 h-2.5"></div>

                    <div className="flex gap-3 items-start">
                      <span className="w-4.5 h-4.5 bg-teal-500 text-white flex items-center justify-center rounded-full text-[9px] font-black shrink-0 mt-0.5 animate-bounce">⏱</span>
                      <div>
                        <strong className="text-xs text-slate-800 block">Awaiting Manual Confirmation</strong>
                        <span className="text-[11px] text-slate-500 leading-normal block mt-0.5">Waiting for administrator oversight. Scanner unlocks in <strong>{paymentTimeLeft}s</strong> if admin is busy.</span>
                      </div>
                    </div>
                  </div>

                  {/* Instant WhatsApp Direct Connection Option */}
                  <div className="max-w-md mx-auto mb-6">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2 text-center">Urgent Scan Request?</p>
                    <a 
                      href={`https://api.whatsapp.com/send?phone=916201186100&text=${encodeURIComponent(`Hello Admin, I have submitted my entry fee of ₹15.\nUTR: ${utrInput}\nName: ${fullName}\nConcern: ${concern}\nPlease approve my file.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs tracking-wide transition shadow-md shadow-emerald-600/10"
                    >
                      <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.022-.014-.508-.25-1.01-.49-.507-.24-.87-.361-1.24-.361-.312 0-.61.161-.83.42l-.567.669c-.21.25-.45.28-.78.113a8.686 8.686 0 0 1-2.316-1.428l-.137-.14a9.082 9.082 0 0 1-1.555-1.921c-.139-.23-.1-.44.07-.63l.512-.604c.15-.17.21-.36.21-.56 0-.25-.13-.56-.25-.83-.16-.36-.45-.96-.75-1.48-.22-.38-.45-.48-.75-.49a1.823 1.823 0 0 0-.27-.01c-.322 0-.751.141-1.062.463-.3.33-1.071 1.07-1.071 2.61a4.912 4.912 0 0 0 1.09 2.583c.121.171 2.513 4.1 6.136 5.511.83.321 1.48.51 1.99.67.83.261 1.58.22 2.18.13.669-.1 1.372-.56 1.562-1.1a1.986 1.986 0 0 0 .151-1.1c-.062-.1-.23-.16-.271-.18zM12.01 2.012a9.98 9.98 0 0 0-9.98 10 9.93 9.93 0 0 0 1.34 4.96l-.88 3.22 3.3-.87a9.982 9.982 0 1 0 6.22-17.31zm0 18a8.036 8.036 0 0 1-4.06-1.1l-.29-.17-1.99.52.53-1.94-.19-.31a8.056 8.056 0 1 1 5.91 3z"/>
                      </svg>
                      <span>Ping Admin over WhatsApp (Instant manual click)</span>
                    </a>
                  </div>

                  {/* TESTING SHORTCUT */}
                  <div className="border-t border-slate-100 pt-5 mt-5">
                    <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 text-left">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Quality Assurance Admin Override</span>
                      </div>
                      <p className="text-[10px] text-amber-700/90 leading-relaxed mb-3">
                        Use this simulation panel to confirm payment instantly on behalf of <strong>+916201186100</strong>, bypass waiting times, and access camera scanning:
                      </p>
                      <button 
                        onClick={handleAdminSimulateApproval}
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-4 rounded-xl text-[10px] uppercase tracking-wider transition transform active:scale-[0.985] flex items-center justify-center gap-1.5"
                      >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "⚡ Approve Payment (Simulate Admin Active)"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div id="view-payment" className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-[0_12px_45px_rgba(0,0,0,0.03)] text-center relative overflow-hidden">
                  <span className="bg-amber-50 text-amber-800 border border-amber-100 text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-extrabold mb-4 inline-block">
                    Diagnostic Scan Unlock (License Fee: ₹15)
                  </span>

                  <h2 className="text-2.5xl font-black text-slate-900 tracking-tight mt-2 mb-2">Activate Telemetry Scanner</h2>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                    Pay a nominal micro-transaction rate of <strong className="text-teal-600">₹15</strong> via instant UPI QR code to retrieve unlimited visual scanning licenses.
                  </p>

                  {/* Simulated UPI QR Engine */}
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-3xl max-w-sm mx-auto mb-6 relative">
                    <div className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md animate-bounce">
                      Live UPI Link
                    </div>
                    <div className="flex justify-center mb-3">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3D9162810434%40ptyes%26pn%3DGlowAI%26am%3D15%26cu%3DINR" 
                        alt="UPI QR Code" 
                        className="w-44 h-44 object-contain border-4 border-teal-600 rounded-2xl p-2.5 bg-white shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="text-xs font-mono font-bold text-slate-450 tracking-wider bg-slate-200/50 py-1 px-3 rounded-full inline-block mb-1">
                      UPI Address ID: <span className="text-slate-800 font-extrabold select-all">9162810434@ptyes</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold text-teal-700">Scan this QR to pay step fees of ₹15</p>
                  </div>

                  {/* Instant Mobile Deep Link */}
                  <a 
                    href="upi://pay?pa=9162810434@ptyes&pn=GlowAI&am=15.00&cu=INR" 
                    className="inline-flex sm:hidden items-center justify-center gap-2 w-full max-w-xs mb-6 bg-teal-50 text-teal-800 font-bold py-3.5 px-5 rounded-2xl border border-teal-200 hover:bg-teal-100 text-xs transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Tap to Pay on Mobile App</span>
                  </a>

                  {/* Automated UTR Simulation Tools for testing ease */}
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-left max-w-md mx-auto mb-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-tight flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Sandboxed Payment Simulator
                      </span>
                      <button 
                        onClick={handleBypassPayment}
                        className="text-[10px] font-extrabold bg-teal-600 text-white px-2 py-1 rounded-lg hover:bg-teal-700 transition"
                      >
                        Auto-Fill Sandbox UTR
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-700">Enter a test code below or click the auto-fill to instantly bypass verification for checking AI scan features.</p>
                  </div>

                  {/* UTR Verification form */}
                  <form id="payment-form" onSubmit={handleVerifyPayment} className="space-y-4 text-left border-t border-slate-100 pt-6">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Enter 12-digit UTR/UPI Ref Code</label>
                      <input 
                        type="text" 
                        id="utr-input" 
                        placeholder="e.g. 312345678901" 
                        pattern="\d{12}" 
                        required 
                        value={utrInput}
                        onChange={(e) => setUtrInput(e.target.value)}
                        title="Enter exactly 12 digits" 
                        className="block w-full p-4 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-2xl focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-mono tracking-widest text-center text-lg font-bold"
                      />
                    </div>
                    
                    <button 
                      id="verify-btn" 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-950/20 text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Verifying Ledger proof...</span>
                        </>
                      ) : (
                        <span>Verify & Unlock Face Scanner</span>
                      )}
                    </button>
                  </form>
                </div>
              )
            )}

            {/* VIEW 4: DYNAMIC CAMERA CAPTURE HUB */}
            {view === "camera" && (
              <div id="view-camera" className="w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.03)]">
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">Active Scan Stream</h2>
                    <p className="text-xs text-slate-400 mt-1">{scanningStatus}</p>
                  </div>
                  
                  <span className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-800 px-3 py-1 rounded-xl text-[10px] font-bold">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-teal-600" />
                    <span>HUD Online</span>
                  </span>
                </div>

                {/* Camera stream container with live geometric elements */}
                <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
                  
                  {cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-900 text-white">
                      <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
                      <p className="text-sm font-bold">{cameraError}</p>
                      <button 
                        onClick={startCameraStream}
                        className="mt-4 px-4 py-2 bg-teal-600 rounded-xl text-xs font-bold hover:bg-teal-700 transition"
                      >
                        Retry Permission Check
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Live streaming video node */}
                      <video 
                        ref={videoRef} 
                        id="video" 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Hidden canvas used to export frame to server */}
                      <canvas ref={canvasRef} id="canvas" className="hidden" />

                      {/* Geometric Scan Laser Grid */}
                      <div className="absolute inset-0 scanner-grid pointer-events-none opacity-40"></div>

                      {/* Sweeping laser line emulator */}
                      <div 
                        className="scanner-line pointer-events-none" 
                        style={{ top: `${laserPosition}%` }}
                      ></div>

                      {/* Clinical Face Alignment targets */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-64 border-2 border-dashed border-teal-400/65 rounded-[3.5rem] flex items-center justify-center relative shadow-[0_0_30px_rgba(45,212,191,0.15)] bg-radial from-transparent to-slate-950/30">
                          
                          {/* Face guidance tag */}
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-[9px] tracking-widest text-white px-3.5 py-1 rounded-full font-extrabold uppercase">
                            FACE ALIGNMENT TARGET
                          </div>

                          {/* Interactive HUD Points imitating professional spatial geometry check */}
                          <div className="absolute top-1/4 left-6 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_6px_#34d399] animate-pulse"></div>
                          <div className="absolute top-1/4 right-6 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_6px_#34d399] animate-pulse"></div>
                          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_6px_#2dd4bf] animate-ping"></div>
                          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_6px_#2dd4bf] animate-ping"></div>
                          
                          {/* Central reticle */}
                          <div className="w-4 h-px bg-white/40"></div>
                          <div className="h-4 w-px bg-white/40 absolute"></div>
                        </div>
                      </div>

                      {/* Live HUD telemetry details */}
                      <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-white flex justify-between items-center text-[10px] uppercase font-mono tracking-widest">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                          <span>SIGNAL STRENGTH: EXCELLENT</span>
                        </div>
                        <div className="text-teal-400 font-bold">GRID CALIB: 98.4%</div>
                      </div>

                      {/* ACTIVE ULTRA-HIGH FIDELITY AI SCANNING OVERLAY */}
                      {loading && (
                        <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-white z-50 animate-fadeIn transition-all duration-300">
                          <div className="relative w-36 h-36 mb-6">
                            {/* Rotating sci-fi circles and targets */}
                            <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-ping" style={{ animationDuration: "2s" }}></div>
                            <div className="absolute inset-2 rounded-full border border-teal-400/30 animate-pulse"></div>
                            <div className="absolute inset-4 rounded-full border-2 border-dashed border-teal-400/60 animate-spin" style={{ animationDuration: "10s" }}></div>
                            <div className="absolute inset-6 rounded-full border border-emerald-400/40 animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }}></div>
                            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-teal-950/80 to-slate-950 flex items-center justify-center shadow-[inset_0_4px_20px_rgba(45,212,191,0.15)] border border-teal-500/30">
                              <Activity className="w-10 h-10 text-teal-400 animate-pulse" />
                            </div>
                            
                            {/* Scanning Radar sweeping hand effect */}
                            <div className="absolute top-1/2 left-1/2 w-1/2 h-1 bg-gradient-to-r from-teal-400 via-teal-500/40 to-transparent origin-left -translate-y-1/2 animate-spin-slow"></div>
                          </div>

                          <div className="space-y-4 max-w-sm px-4">
                            <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full font-mono tracking-widest uppercase font-extrabold animate-pulse inline-block">
                              GlowAI Telemetry Processing
                            </span>
                            <h3 className="text-lg font-black tracking-tight text-white leading-snug">Analyzing Dermal Matrices</h3>
                            <p className="text-xs text-slate-350 leading-relaxed font-mono min-h-12 bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl">
                              {statusMsg || "Scanning face alignment and measuring microtonal texture..."}
                            </p>
                          </div>

                          {/* Progress pipeline indicator */}
                          <div className="mt-8 w-60 bg-slate-800/80 h-1 rounded-full overflow-hidden relative border border-slate-700/20">
                            <div className="absolute top-0 left-0 bg-gradient-to-r from-teal-500 to-emerald-400 h-full w-full rounded-full animate-shimmer" style={{ backgroundSize: "200% 100%" }}></div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Primary click trigger to capture & execute backend API lookup */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleCaptureAndAnalyze}
                    id="capture-btn"
                    disabled={loading || !!cameraError}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-40 text-white font-bold py-4.5 px-6 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        <span>Dermal Telemetry Scan active...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        <span>Capture Face & Analyze Dermal Layer</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={stopCameraStream}
                    className="px-6 py-4.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition text-xs"
                  >
                    Close Camera Focus
                  </button>
                </div>

                {/* Hinglish Instructions for the Scanner */}
                <div id="scanner-hinglish-info" className="mt-6 p-4.5 bg-gradient-to-r from-teal-50/40 to-emerald-50/40 border border-teal-100 rounded-2v2 rounded-2xl text-left">
                  <span className="text-[10px] uppercase font-black tracking-widest text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md inline-block mb-2">📸 Photo Sahi Se Kaise Leinge?</span>
                  <ul className="text-xs text-slate-650 space-y-2 leading-relaxed list-disc list-inside">
                    <li>Apne chehre (face) ko screen par banaye gaye <strong>dashed target line ke theek bich-o-bich (center position)</strong> me rakhein.</li>
                    <li>Sahi results ke liye camera ke samne <strong>achhi light (bright light)</strong> honi chahiye taaki features clear dikhein.</li>
                    <li><strong>Capture</strong> button dabate hi computer algorithm aapki skin moisture, oil level aur pores ko scan karke custom skin routine dikha dega!</li>
                  </ul>
                </div>
              </div>
            )}

            {/* VIEW 5: COMPREHENSIVE DERMATOLOGICAL PRESCRIPTIVE SUITE */}
            {view === "results" && analysisResult && (
              <div id="result-box" className="w-full space-y-8 animate-fadeIn">
                
                {/* Visual success notice banner */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">Evaluation Generated Successfully</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Gemini Diagnostic multi-spectral scan matched clinically sound treatment protocols.</p>
                      
                      {/* Active display of remaining scan package details */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                          (user?.scansRemaining ?? 0) > 1 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : (user?.scansRemaining ?? 0) === 1 
                              ? "bg-amber-100 text-amber-800 border-amber-200 animate-pulse" 
                              : "bg-rose-100 text-rose-800 border-rose-200"
                        }`}>
                          <span>🎟️ One-Time Paid License: {user?.scansRemaining ?? 0} Scan{(user?.scansRemaining ?? 1) !== 1 ? "s" : ""} Remaining</span>
                        </span>
                        {(user?.scansRemaining ?? 0) === 0 && (
                          <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wide">Credits Depleted — Next scan requires new license (₹15)</span>
                        )}
                      </div>

                      {/* AI Scan Status Badge */}
                      {analysisResult.isFallback ? (
                        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[11px] text-amber-900 leading-relaxed text-left flex items-start gap-2.5 max-w-xl">
                          <span className="text-sm shrink-0">⚠️</span>
                          <div>
                            <span className="font-extrabold text-amber-950">Offline Sandbox Active:</span>{" "}
                            No active <code>GEMINI_API_KEY</code> detected in Vercel or your local environment. Every snapshot will load structured clinical templates. To launch <strong>Real-Time Custom Face Analysis</strong>, please set up the <code>GEMINI_API_KEY</code> secret variable on the Vercel dashboard.
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 bg-teal-50 border border-teal-150 rounded-2xl p-4 text-[11px] text-teal-900 leading-relaxed text-left flex items-start gap-2.5 max-w-xl">
                          <span className="text-sm shrink-0">✨</span>
                          <div>
                            <span className="font-extrabold text-teal-950">Live Gemini Scan Active:</span>{" "}
                            Successfully verified and computed customized dermatological feedback using the live visual AI scanning pipeline.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (user && (user.paymentVerified || (user.scansRemaining ?? 0) > 0)) {
                        startCameraStream();
                        setView("camera");
                      } else {
                        // Scan tokens are used up! Force renewal to pay price again
                        setStatusMsg("Your 5-scan trial package has expired. Redirecting to payment check...");
                        setTimeout(() => {
                          setStatusMsg("");
                          setView("payment");
                        }, 2000);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 rounded-xl text-xs font-bold text-slate-700 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake Scan</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column: Diagnostics Summary & Scores */}
                  <div className="md:col-span-2 space-y-6">
                    
                    {/* Skin Profile details */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-250 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                      <span className="text-[10px] font-extrabold text-teal-650 bg-teal-50 border border-teal-100 uppercase tracking-widest px-3 py-1.5 rounded-full inline-block">
                        Clinical Phenotype Record
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl flex justify-between items-center">
                          <span className="text-xs text-slate-450 uppercase font-black">Identified Skin Classification</span>
                          <span className="text-sm font-extrabold text-teal-650 bg-teal-50 border border-teal-100 px-3 py-1 rounded-lg">{analysisResult.skin_type}</span>
                        </div>

                        <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl flex flex-col justify-between">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Assessed Major Concerns</span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.primary_concerns.map((con, index) => (
                              <span key={index} className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                                {con}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-150">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-600" /> Executive Health Summary
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed italic bg-emerald-50/20 p-4.5 rounded-2xl border border-emerald-50 text-justify">
                          "{analysisResult.skin_health_summary}"
                        </p>
                      </div>
                    </div>

                    {/* Integrated Metric Scores using high-fidelity geometric bar charts list */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Epidermal Metric Readings</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Hydration Score */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium flex items-center gap-1.5">
                              <Droplet className="w-3.5 h-3.5 text-blue-500" /> Hydration Level
                            </span>
                            <span className="font-extrabold text-slate-800">{analysisResult.skin_scores.hydration}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${analysisResult.skin_scores.hydration}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] text-slate-400 block">Relative fluid content inside stratum corneum.</span>
                        </div>

                        {/* Sebum/Clarity Score */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-orange-500" /> Skin Clarity Index
                            </span>
                            <span className="font-extrabold text-slate-800">{analysisResult.skin_scores.clarity}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${analysisResult.skin_scores.clarity}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] text-slate-400 block">Absence of open comedones, redness, or congestion.</span>
                        </div>

                        {/* Smoothness Index */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Texture Smoothness
                            </span>
                            <span className="font-extrabold text-slate-800">{analysisResult.skin_scores.smoothness}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${analysisResult.skin_scores.smoothness}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] text-slate-400 block font-mono">Elasticity coefficient and cellular structure consistency indices.</span>
                        </div>

                        {/* Barrier Check */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium flex items-center gap-1.5">
                              <Heart className="w-3.5 h-3.5 text-rose-500" /> Dermal Barrier Strength
                            </span>
                            <span className="font-extrabold text-slate-800">{analysisResult.skin_scores.barrier}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-rose-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${analysisResult.skin_scores.barrier}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] text-slate-400 block">Ceramide composition resistance to moisture evaporation.</span>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Right Column: Prescription Plan Card */}
                  <div className="space-y-6">
                    
                    {/* Prescription Details Card matching "Geometric Balance" design structure */}
                    <div className="bg-slate-900 rounded-3xl p-6.5 shadow-xl text-white relative overflow-hidden flex flex-col justify-between h-full">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
                      
                      <div>
                        <h3 className="text-xs font-black text-teal-400 uppercase tracking-widest mb-6">Prescription Plan</h3>
                        
                        <div className="space-y-6">
                          
                          {/* AM (Morning Routine) */}
                          <div className="border-l-2 border-teal-500/55 pl-4 py-0.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-extrabold bg-teal-500/20 text-teal-300 uppercase tracking-wider px-2 py-0.5 rounded-md">
                                Morning AM
                              </span>
                            </div>
                            <div className="space-y-1.5 mt-2">
                              <p className="text-xs font-medium text-slate-300">
                                <strong className="text-white block text-xs">① Cleanse:</strong> {analysisResult.routine.morning.step1}
                              </p>
                              <p className="text-xs font-medium text-slate-300">
                                <strong className="text-white block text-xs">② Target Treatment:</strong> {analysisResult.routine.morning.step2}
                              </p>
                              <p className="text-xs font-medium text-slate-300">
                                <strong className="text-white block text-xs">③ Protect:</strong> {analysisResult.routine.morning.step3}
                              </p>
                            </div>
                          </div>

                          {/* PM (Evening Routine) */}
                          <div className="border-l-2 border-teal-500/55 pl-4 py-0.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-extrabold bg-purple-500/20 text-purple-300 uppercase tracking-wider px-2 py-0.5 rounded-md">
                                Evening PM
                              </span>
                            </div>
                            <div className="space-y-1.5 mt-2">
                              <p className="text-xs font-medium text-slate-300">
                                <strong className="text-white block text-xs">① Cleanse:</strong> {analysisResult.routine.evening.step1}
                              </p>
                              <p className="text-xs font-medium text-slate-300">
                                <strong className="text-white block text-xs">② Active Treatment:</strong> {analysisResult.routine.evening.step2}
                              </p>
                              <p className="text-xs font-medium text-slate-300">
                                <strong className="text-white block text-xs">③ Barrier Lock:</strong> {analysisResult.routine.evening.step3}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-800">
                        <button 
                          onClick={handlePrintReport}
                          className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-bold rounded-xl transition-all tracking-wider text-center flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>EXPORTS ANALYTIC PDF</span>
                        </button>
                        <p className="text-[9px] text-slate-450 tracking-wider text-center mt-3 uppercase">Licensed under Clinical AI Diagnostics code 7742</p>
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* VIEW 6: INDEPENDENT SKIN JOURNAL & DERMATOLOGICAL SCIENCE PORTAL */}
            {view === "journal" && (
              <div id="skincare-journal-blogs" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">My Skin Journal & Face Blog</h3>
                        <p className="text-xs text-slate-500">Document your facial condition, daily skin thoughts, and product testing results.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full uppercase tracking-widest self-start sm:self-center font-mono">
                      {blogs.length} Recorded Entries
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Form: Write a blog post */}
                    <div className="lg:col-span-5 space-y-4">
                      <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest flex items-center gap-2">
                        <PenTool className="w-3.5 h-3.5 text-teal-600" /> Write New Journal Entry
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mb-1">Entry Title</label>
                          <input 
                            type="text"
                            placeholder="e.g., Week 2 Acne Healing Progress"
                            value={blogTitle}
                            onChange={(e) => setBlogTitle(e.target.value)}
                            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:bg-white outline-none font-semibold transition"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mb-1">Face Observations (Redness, dryness, shine...)</label>
                          <input 
                            type="text"
                            placeholder="e.g., Cheeks are less dehydrated, light purging on temples"
                            value={blogObservations}
                            onChange={(e) => setBlogObservations(e.target.value)}
                            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:bg-white outline-none font-semibold transition"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mb-1">Products & Actives Tested</label>
                          <input 
                            type="text"
                            placeholder="e.g., Cetaphil Wash, GlowAI routine Morning AM steps"
                            value={blogProducts}
                            onChange={(e) => setBlogProducts(e.target.value)}
                            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:bg-white outline-none font-semibold transition"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mb-1">Detailed Daily Notes / Experiences</label>
                          <textarea 
                            rows={3}
                            placeholder="Describe how your face feels today. Highlight changes compared to yesterday's snapshot or previous dermatology scans..."
                            value={blogNotes}
                            onChange={(e) => setBlogNotes(e.target.value)}
                            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:bg-white outline-none font-semibold transition resize-none leading-relaxed"
                          ></textarea>
                        </div>

                        <button
                          onClick={handleSaveBlog}
                          disabled={!blogTitle.trim()}
                          className="w-full py-3 bg-slate-900 border border-slate-900 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.985] flex items-center justify-center gap-1.5"
                        >
                          <span>Save Face Entry</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Timeline: List previous logs */}
                    <div className="lg:col-span-7 space-y-4">
                      <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest">My Journal Timeline</h4>
                      
                      {blogs.length === 0 ? (
                        <div className="h-64 border border-dashed border-slate-200 rounded-2xl flex flex-col justify-center items-center text-center p-6 bg-slate-50/50">
                          <BookOpen className="w-8 h-8 text-slate-300 mb-2.5" />
                          <p className="text-xs font-extrabold text-slate-900">Your skincare journal timeline is empty.</p>
                          <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">Write your first facial observation blog in the column on the left to securely record your progress!</p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                          {blogs.map((b) => (
                            <div key={b.id} className="bg-slate-50 rounded-2xl p-4.5 border border-slate-150 relative hover:border-teal-350 transition duration-300">
                              <button 
                                onClick={() => handleDeleteBlog(b.id)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition"
                                title="Remove entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-extrabold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-mono">
                                  {b.date}
                                </span>
                              </div>

                              <h5 className="font-extrabold text-slate-900 text-sm tracking-tight">{b.title}</h5>
                              
                              <div className="mt-2.5 space-y-1.5 text-[11px] leading-relaxed">
                                {b.observations && (
                                  <p className="text-slate-500 font-medium font-sans">
                                    <strong className="text-slate-800">Observations:</strong> {b.observations}
                                  </p>
                                )}
                                {b.productsTried && (
                                  <p className="text-slate-500 font-medium font-sans">
                                    <strong className="text-slate-800">Actives Used:</strong> {b.productsTried}
                                  </p>
                                )}
                                {b.detailedNotes && (
                                  <p className="text-slate-600 bg-white border border-slate-100 p-2.5 rounded-lg text-justify mt-1.5 italic font-sans font-light">
                                    "{b.detailedNotes}"
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                {/* Additional simulated analysis info card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-slate-600 text-xs leading-relaxed flex flex-col sm:flex-row gap-4 items-center">
                  <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-800 block text-xs font-extrabold mb-1">Dermatological Screening Advisory Notice</strong>
                    <span>These diagnostic conclusions are generated based on the multi-spectral analysis of facial image parameters via vision modeling. It does not replace a physician consultation. Always carry out spot allergen checks on newly introduced topical cosmetic items before starting regular use.</span>
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 7: ADMINISTRATOR DASHBOARD LEDGER & OVERRIDES */}
            {view === "admin" && (
              user?.email === "gulshankumar9934293812@gmail.com" ? (
                <div id="view-admin" className="w-full space-y-8 animate-fadeIn text-slate-850">
                  
                  {/* 1. Header Overview Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4.5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Patients</span>
                        <strong className="text-2xl font-black text-slate-900 leading-none">{adminUsers.length}</strong>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold animate-pulse shrink-0">
                        <DollarSign className="w-6 h-6 animate-bounce" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Pending Approvals</span>
                        <strong className="text-2xl font-black text-amber-600 leading-none">{adminPending.length}</strong>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Verified Access</span>
                        <strong className="text-2xl font-black text-slate-900 leading-none">
                          {adminUsers.filter((u) => u && u.paymentVerified).length}
                        </strong>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4.5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Active System Mode</span>
                        <strong className="text-xs font-black text-teal-600 leading-none uppercase font-mono tracking-widest mt-0.5 block">LIVE PRODUCTION</strong>
                      </div>
                    </div>
                  </div>

                  {/* 2. Main Ledger Grid layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN (COL-SPAN-5): PENDING UTR PAYMENTS WAITING APPROVAL */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex justify-between items-center bg-slate-900 text-white rounded-t-2xl px-5 py-4.5 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-100">
                            Pending Approvals Ledger ({adminPending.length})
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono tracking-widest uppercase bg-amber-500/20 text-amber-300 px-2 py-1 rounded-[6px] font-bold">
                          Awaiting Action
                        </span>
                      </div>

                      <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl p-4.5 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar shadow-xs">
                        {adminPending.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 font-medium">
                            <CheckCircle className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                            <p className="text-xs font-extrabold text-slate-700">All payments up to date!</p>
                            <p className="text-[10px] text-slate-400 mt-1">There are no pending manual UTR approvals.</p>
                          </div>
                        ) : (
                          adminPending.map((p, idx) => {
                            if (!p) return null;
                            return (
                              <div 
                                key={`${p.email || idx}_pending_${idx}`} 
                                className="bg-amber-50/50 border border-amber-150 p-4 rounded-xl space-y-3 hover:shadow-xs transition relative text-left"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="text-left">
                                    <h5 className="text-xs font-extrabold text-slate-900">{p.name || "Anonymous Patient"}</h5>
                                    <span className="text-[10px] text-slate-450 font-mono block select-all">{p.email}</span>
                                  </div>
                                  <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold tracking-tight shrink-0">
                                    Age: {p.age} • {p.concern}
                                  </span>
                                </div>

                                <div className="bg-white px-3 py-2.5 rounded-lg border border-amber-200 text-left">
                                  <span className="text-[9px] font-black uppercase text-amber-600 block tracking-wider">Submitted UTR Payment Code</span>
                                  <strong className="text-xs font-mono font-extrabold text-slate-800 tracking-wider block select-all bg-amber-50/20 px-1 py-0.5 mt-0.5 border border-dashed border-amber-300/50 rounded">
                                    {p.utr || "NO UTR PROVIDED"}
                                  </strong>
                                  {p.submittedAt && (
                                    <span className="text-[9px] text-slate-455 block mt-1.5 font-mono">
                                      Logged: {p.submittedAt}
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-2.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAdminLedgerAction(p.email, "approve")}
                                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-extrabold tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1 shadow-xs border-0"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> Approve Code
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAdminLedgerAction(p.email, "reject")}
                                    className="py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1 shadow-xs border-0"
                                  >
                                    Reject / Clear
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* RIGHT COLUMN (COL-SPAN-7): SYSTEM PATIENTS REGISTRY DATABASE */}
                    <div className="lg:col-span-7 space-y-4">
                      
                      {/* Filter and Search Controls Block */}
                      <div className="bg-white border border-slate-205 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
                        
                        <div className="relative w-full sm:max-w-xs">
                          <input 
                            type="text"
                            placeholder="Search patient record by name, email, concern, or UTR..."
                            value={adminSearch}
                            onChange={(e) => setAdminSearch(e.target.value)}
                            className="w-full text-xs p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-450 focus:bg-white transition outline-none font-semibold text-slate-850"
                          />
                          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-455" />
                        </div>

                        <div className="flex gap-2.5 w-full sm:w-auto shrink-0 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setAdminSearch("");
                              fetchAdminRecords(sessionId);
                            }}
                            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-0 outline-none"
                            title="Refresh server record database"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                            <span>Pull Database</span>
                          </button>
                        </div>

                      </div>

                      {/* Patient Ledger table list */}
                      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                        <div className="bg-slate-100 text-slate-705 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between font-bold text-xs uppercase tracking-wider">
                          <span>Patient Diagnostics Registry List</span>
                          <span className="text-[10px] font-mono font-extrabold text-slate-455 tracking-tight italic normal-case">
                            Showing {adminUsers.filter((u) => {
                              if (!u) return false;
                              const q = adminSearch.toLowerCase();
                              const nameVal = (u.name || "").toLowerCase();
                              const emailVal = (u.email || "").toLowerCase();
                              const utrVal = (u.utr || "").toLowerCase();
                              return nameVal.includes(q) || emailVal.includes(q) || (u.utr && utrVal.includes(q));
                            }).length} of {adminUsers.length} total profiles
                          </span>
                        </div>

                        <div className="p-2 divide-y divide-slate-100 max-h-[515px] overflow-y-auto custom-scrollbar">
                          {adminUsers.filter((u) => {
                            if (!u) return false;
                            const q = adminSearch.toLowerCase();
                            const nameVal = (u.name || "").toLowerCase();
                            const emailVal = (u.email || "").toLowerCase();
                            const utrVal = (u.utr || "").toLowerCase();
                            const concernVal = (u.concern || "").toLowerCase();
                            return (
                              nameVal.includes(q) ||
                              emailVal.includes(q) ||
                              (u.utr && utrVal.includes(q)) ||
                              (u.concern && concernVal.includes(q))
                            );
                          }).length === 0 ? (
                            <div className="py-16 text-center text-slate-400 font-medium">
                              <Search className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                              <p className="text-xs font-bold text-slate-500">No matched profiles found</p>
                              <p className="text-[10px] text-slate-400 mt-1">Refine your active search query parameter and retry filter bounds.</p>
                            </div>
                          ) : (
                            adminUsers
                              .filter((u) => {
                                if (!u) return false;
                                const q = adminSearch.toLowerCase();
                                const nameVal = (u.name || "").toLowerCase();
                                const emailVal = (u.email || "").toLowerCase();
                                const utrVal = (u.utr || "").toLowerCase();
                                const concernVal = (u.concern || "").toLowerCase();
                                return (
                                  nameVal.includes(q) ||
                                  emailVal.includes(q) ||
                                  (u.utr && utrVal.includes(q)) ||
                                  (u.concern && concernVal.includes(q))
                                );
                              })
                              .map((u, idx) => (
                                <div 
                                  key={`${u.email}_directory_${idx}`} 
                                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition duration-155 text-left rounded-2xl border border-slate-100 bg-white my-1"
                                >
                                  <div className="flex items-start gap-4 flex-1">
                                    {/* Patient Profile Picture */}
                                    <div 
                                      className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer shadow-xs hover:scale-105 transition duration-150"
                                      onClick={() => u.picture && setSelectedScanImageModal(u.picture)}
                                      title="Click to zoom profile picture"
                                    >
                                      <img 
                                        src={u.picture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.name || "Anon")}`} 
                                        className="w-full h-full object-cover" 
                                        alt="Patient profile"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>

                                    <div className="space-y-1.5 flex-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h5 className="font-extrabold text-slate-900 text-sm md:text-base tracking-tight truncate">{u.name || "Anonymous Patient"}</h5>
                                        
                                        {u.paymentVerified ? (
                                          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-150 flex items-center gap-1 uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Verified Patient
                                          </span>
                                        ) : (
                                          <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-150 flex items-center gap-1 uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span> Unverified
                                          </span>
                                        )}

                                        {u.email === "gulshankumar9934293812@gmail.com" && (
                                          <span className="text-[9px] font-extrabold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-wider">
                                            Owner / Admin
                                          </span>
                                        )}
                                      </div>

                                      <div className="text-xs text-slate-500 space-y-1">
                                        <p className="font-mono text-slate-455 select-all truncate font-semibold">{u.email}</p>
                                        <p className="font-medium text-slate-600">
                                          Background Profile: <strong className="text-slate-800">Age {u.age || "N/A"}</strong> — Concern: <strong className="text-teal-700 font-extrabold">{u.concern || "None Registered"}</strong>
                                        </p>
                                        
                                        {u.utr && (
                                          <p className="font-mono bg-slate-100/80 text-slate-750 px-2 py-0.5 rounded-md text-[10px] inline-flex items-center gap-1.5 border border-slate-200">
                                            <span>Approved UTR:</span> 
                                            <strong className="text-slate-900 font-extrabold tracking-wider select-all">{u.utr}</strong>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Patient Scan Snapshot Image Box */}
                                  <div className="flex items-center gap-5 shrink-0 justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    {u.lastScanImage ? (
                                      <div className="flex flex-col items-center">
                                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Latest Face Scan</span>
                                        <div 
                                          onClick={() => setSelectedScanImageModal(u.lastScanImage)}
                                          className="w-16 h-16 rounded-2xl border-2 border-teal-200 bg-teal-50/50 flex items-center justify-center overflow-hidden shadow-sm cursor-pointer hover:scale-105 active:scale-95 hover:border-teal-450 transition duration-200"
                                          title="Click to zoom face scan image"
                                        >
                                          <img src={u.lastScanImage} className="w-full h-full object-cover" alt="Last Face Scan" />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center">
                                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Latest Face Scan</span>
                                        <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-350" title="No scan snapshot recorded yet">
                                          <Camera className="w-5 h-5 opacity-60" />
                                          <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">No Scan</span>
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex flex-col items-end gap-1.5 text-right">
                                      <div className="text-[10px] text-slate-450 font-mono tracking-wider">
                                        Scans Remaining: <strong className="text-slate-800 font-extrabold text-xs">{u.scansRemaining}</strong>
                                      </div>
                                      
                                      {u.email !== "gulshankumar9934293812@gmail.com" && (
                                        <div className="flex gap-1.5">
                                          {u.paymentVerified ? (
                                            <button 
                                              onClick={() => handleAdminLedgerAction(u.email, "reject")}
                                              className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:text-rose-700 px-3 py-1.5 rounded-xl transition cursor-pointer"
                                              title="Revoke active verified access status and require setup again"
                                            >
                                              Revoke Verify
                                            </button>
                                          ) : (
                                            <button 
                                              onClick={() => handleAdminLedgerAction(u.email, "approve")}
                                              className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition cursor-pointer border-0"
                                            >
                                              Force Verify
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                </div>
                              ))
                          )}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Additional Clinical Database logs note card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs leading-relaxed text-slate-600 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block text-xs font-black uppercase tracking-wider mb-1">Administrative Security Protocol Statement</strong>
                      <span>All digital overrides executed via this clinical console are permanently serialized and bound to the Active Administration session. Approvals will instantly notify the patient's registered visual instance and unlock dynamic camera spectral scanning features. Verified status remains permanently active unless manually revoked or flushed by database cycles.</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="w-full max-w-md mx-auto my-12 bg-white border border-rose-200 rounded-3xl p-8 text-center shadow-lg">
                  <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-950 mb-2">Access Restrained</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    This control ledger is strictly restricted to authenticated medical administration credentials.
                  </p>
                  <button 
                    onClick={() => setView("details")}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    Return to Patient Portal
                  </button>
                </div>
              )
            )}

            {/* VIEW 8: INTERACTIVE WHATSAPP AI BOT PLAYGROUND */}
            {view === "whatsapp" && (
              <div id="view-whatsapp" className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
                
                {/* Visual Header Banner */}
                <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-550/10 border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                      <MessageCircle className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">GlowAI WhatsApp AI Dermatologist Bot</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Instant skin diagnosis, active product advice, and biological remedies straight to your mobile screen!</p>
                    </div>
                  </div>
                  
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Bot Engine</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT DETAILED COLUMN (COL-SPAN-4): HOW TO CONNECT REAL WHATSAPP */}
                  <div className="lg:col-span-5 space-y-6 text-left">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                        <span>📱 Real-world Integration Guidance</span>
                      </h4>

                      <div className="space-y-4 text-xs leading-relaxed text-slate-650">
                        <p>
                          GlowAI possesses a robust server-side WhatsApp dispatch mechanism already bound to phone number <strong className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold">+916201186100</strong>. It automatically sends alerts when:
                        </p>
                        
                        <ul className="space-y-2.5 list-none pl-0">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✔</span>
                            <span>A patient submits a setup fee (notifying the admin with the exact payment UTR).</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✔</span>
                            <span>A clinical audit report is compiled by the multi-spectral computer scanner.</span>
                          </li>
                        </ul>

                        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3 mt-4">
                          <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">⚡ Run a Test Notification Trigger</span>
                          <p className="text-[11px] text-slate-500">
                            Send direct verification ping alert details payload containing your active credentials (<strong>{user?.name || fullName}</strong>) over to WhatsApp support line:
                          </p>
                          
                          <a 
                            href={`https://api.whatsapp.com/send?phone=916201186100&text=${encodeURIComponent(`[GlowAI System Trigger Ping]\nPatient Name: ${user?.name || fullName}\nConcern: ${user?.concern || concern}\nSession: ${sessionId}\nRequest: Instant AI Bot analysis check.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Ping WhatsApp Number</span>
                          </a>
                        </div>

                        <div className="border-t border-slate-100 pt-4 text-[11px] text-slate-450 italic">
                          💡 You can configure CallMeBot WhatsApp API Key inside <code>/server.ts</code> line 359 to forward automated custom alerts straight to your own personal phone device!
                        </div>
                      </div>
                    </div>

                    {/* Hinglish Quick FAQ */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-left">
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md tracking-wider inline-block">💬 Hindi User FAQ</span>
                      <h4 className="font-extrabold text-slate-900 text-sm tracking-tight mt-3">Mera WhatsApp Bot Kaise Use Karein?</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                        Aap side me diye gye mobile pane me apne skin questions Hindi ya Hinglish me type karein (Jaise: <em>"Dry wrinkles ke liye kya lagayein?"</em>). 
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">
                        Humara server-side Gemini Clinical Agent aapko turant direct message reply formulate karke ek dum fresh dynamic morning AM & evening PM routing suggest karega!
                      </p>
                    </div>
                  </div>

                  {/* RIGHT COLUMN (COL-SPAN-7): INTERACTIVE HIGH FIDELITY MOBILE PHONE CHAT FRAME */}
                  <div className="lg:col-span-7 flex flex-col items-center">
                    
                    {/* The WhatsApp Mobile phone Mockup Frame */}
                    <div className="w-full max-w-sm rounded-[2.5rem] border-8 border-slate-900 bg-slate-950 shadow-2xl overflow-hidden relative flex flex-col">
                      
                      {/* Top Mobile Notch */}
                      <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 flex justify-center items-center z-20">
                        <div className="w-16 h-3.5 bg-black rounded-b-xl"></div>
                      </div>

                      {/* WhatsApp Header block */}
                      <div className="bg-[#075E54] text-white pt-6 pb-3 px-4 flex items-center justify-between shrink-0 select-none z-10 shadow-md">
                        <div className="flex items-center gap-2.5 mt-1">
                          {/* Back sign */}
                          <span className="text-sm font-bold opacity-80 cursor-pointer">←</span>
                          {/* Doctor Bot Avatar */}
                          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-800 font-extrabold shrink-0 border border-emerald-100/30 overflow-hidden shadow-inner">
                            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=glowai_dermatology_bot" alt="Dr. Bot" className="w-full h-full object-cover scale-110" />
                          </div>
                          <div className="text-left leading-tight">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold tracking-wide">GlowAI Bot</span>
                              {/* Verified green shield tick badge */}
                              <span className="inline-block text-[8px] bg-emerald-500 text-white p-0.5 rounded-full" title="Verified Skincare Specialist">✓</span>
                            </div>
                            <span className="text-[10px] text-teal-200 block font-light flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              online
                            </span>
                          </div>
                        </div>

                        {/* Visual helper call and menu buttons */}
                        <div className="flex gap-3 text-slate-200 text-sm mt-1">
                          <span className="cursor-pointer hover:text-white">📞</span>
                          <span className="cursor-pointer hover:text-white">⋮</span>
                        </div>
                      </div>

                      {/* WhatsApp Chat messages wall */}
                      <div className="h-96 overflow-y-auto p-3.5 bg-[#efeae2]/90 space-y-3.5 flex flex-col custom-scrollbar relative">
                        {/* Elegant background grid overlay */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                        
                        {whatsappMessages.map((msg) => {
                          if (msg.sender === "system") {
                            return (
                              <div key={msg.id} className="text-center z-10 my-0.5">
                                <span className="inline-block bg-[#ffe082]/75 text-slate-800 text-[9px] font-bold py-1 px-3 rounded-lg shadow-2xs max-w-[90%] font-mono leading-normal">
                                  {msg.text}
                                </span>
                              </div>
                            );
                          }

                          const isUser = msg.sender === "user";
                          return (
                            <div 
                              key={msg.id} 
                              className={`z-10 p-3 rounded-2xl shadow-2xs text-xs max-w-[85%] text-left leading-normal flex flex-col justify-between ${
                                isUser 
                                  ? "bg-[#dcf8c6] text-slate-800 ml-auto rounded-tr-none animate-fadeIn" 
                                  : "bg-white text-slate-800 rounded-tl-none animate-fadeIn"
                              }`}
                            >
                              <div className="whitespace-pre-wrap font-sans font-medium text-[11.5px] leading-relaxed break-words">
                                {msg.text.split("\n").map((line, idx) => {
                                  // Formatting whatsapp-style *bold* tags on line values safely
                                  let formattedLine = line;
                                  formattedLine = formattedLine.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
                                  return <p key={idx} dangerouslySetInnerHTML={{ __html: formattedLine }} className="min-h-3" />;
                                })}
                              </div>
                              <span className="text-[8px] text-slate-400 font-mono tracking-widest uppercase self-end mt-1.5">
                                {msg.time} {isUser && <span className="text-sky-500 ml-0.5">✓✓</span>}
                              </span>
                            </div>
                          );
                        })}

                        {/* Chat Bot logic is calculating model response */}
                        {whatsappLoading && (
                          <div className="bg-white text-slate-800 rounded-2xl rounded-tl-none p-3.5 shadow-2xs text-xs max-w-[80%] text-left inline-flex items-center gap-2 animate-pulse self-start z-10 transition">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 shrink-0" />
                            <span className="font-mono text-[10px] text-slate-450 font-bold uppercase tracking-wider">Dr. GlowAI Bot is typing...</span>
                          </div>
                        )}
                      </div>

                      {/* WhatsApp Input panel */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendWhatsAppChat();
                        }}
                        className="bg-[#f0f0f0] p-2.5 flex gap-2 items-center shrink-0 border-t border-slate-205 z-10"
                      >
                        <input 
                          type="text" 
                          required
                          value={whatsappInput}
                          onChange={(e) => setWhatsappInput(e.target.value)}
                          placeholder="Type skincare query..."
                          disabled={whatsappLoading}
                          className="flex-1 py-2 px-3.5 bg-white border border-slate-200 outline-none rounded-full text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-emerald-600 transition"
                        />
                        
                        <button 
                          type="submit" 
                          disabled={!whatsappInput.trim() || whatsappLoading}
                          className="rounded-full w-9 h-9 bg-[#128c7e] hover:bg-[#075e54] text-white flex items-center justify-center shrink-0 shadow-sm transition disabled:opacity-45 outline-none border-0 select-none cursor-pointer"
                        >
                          <Send className="w-4 h-4 shrink-0" />
                        </button>
                      </form>

                    </div>

                    {/* Pre-defined Hinglish prompt chips */}
                    <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-sm">
                      {[
                        { text: "Face par pimples help", label: "🔥 Acne Solution" },
                        { text: "Dry wrinkles routine", label: "💧 Dry Skin Care" },
                        { text: "Dull skin spots care", label: "☀️ Dark Spots" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!whatsappLoading) {
                              setWhatsappInput(item.text);
                            }
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-emerald-50 hover:border-emerald-250 border border-slate-200 text-slate-650 rounded-full text-[10px] font-bold transition shadow-2xs shrink-0 cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* Outer Minimal Aesthetic footer element */}
        <footer className="h-14 bg-white border-t border-slate-200/80 shrink-0 flex items-center justify-between px-8 text-[11px] text-slate-400 font-mono">
          <div>GlowAI Web Portal v1.4.0 Live Engine</div>
          <div className="flex gap-4">
            <span>HIPAA Compliant</span>
            <span>Secure SSL Encrypted</span>
          </div>
        </footer>

        {/* Floating Share App Button */}
        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className="fixed bottom-6 right-6 z-40 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3.5 shadow-xl transition-all duration-300 hover:scale-[1.08] flex items-center justify-center cursor-pointer border-0 outline-none hover:shadow-teal-500/20 animate-bounce"
          title="Share GlowAI Platform"
        >
          <Share2 className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-bold tracking-wider uppercase pl-1.5 pr-1 hidden sm:inline">Share App</span>
        </button>

        {/* SHARE APP DIALOG OVERLAY */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-200 shadow-2xl relative text-left mx-4 text-slate-850">
              
              {/* Header indicator */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-teal-650" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 font-sans tracking-tight">Share GlowAI Platform</h3>
                    <p className="text-[10px] text-slate-450">Invite friends & family to scan their skin!</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-black text-xl hover:bg-slate-150 h-8 w-8 rounded-full flex items-center justify-center transition cursor-pointer bg-transparent border-0 outline-none"
                >
                  ×
                </button>
              </div>

              {/* Share platform grid */}
              <div className="py-5 space-y-4">
                <p className="text-xs text-slate-500 font-medium">GlowAI platform ko separate channels ya friends ke saath share karein:</p>
                
                <div className="grid grid-cols-3 gap-2.5">
                  {/* WhatsApp */}
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Namaste! Main apne acne and dry skin care routine ke liye GlowAI App recommend kar raha hu. Isme high-tech live AI Skin Scanning aur personalized dermatologist advice milti hai, check out: https://ais-pre-ircpwuehdczjjtvto6qsow-649656015455.asia-southeast1.run.app")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100/60 transition text-center group no-underline"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg mb-1.5 shadow-sm group-hover:scale-105 transition-all">
                      💬
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">WhatsApp</span>
                  </a>

                  {/* Telegram */}
                  <a 
                    href={`https://t.me/share/url?url=${encodeURIComponent("https://ais-pre-ircpwuehdczjjtvto6qsow-649656015455.asia-southeast1.run.app")}&text=${encodeURIComponent("Check out GlowAI! A high-tech AI Skin Scanner that builds custom dermatology guided skincare remedies.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-100/60 transition text-center group no-underline"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition-all">
                      ✈
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Telegram</span>
                  </a>

                  {/* X / Twitter */}
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Scanned my skin using GlowAI, the custom dermatologist model! Check out your skin report here:")}&url=${encodeURIComponent("https://ais-pre-ircpwuehdczjjtvto6qsow-649656015455.asia-southeast1.run.app")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-850 text-white border border-slate-950 transition text-center group no-underline"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs mb-1.5 shadow-sm group-hover:scale-105 transition-all font-mono font-black">
                      X
                    </div>
                    <span className="text-[10px] font-bold text-slate-200">Twitter / X</span>
                  </a>

                  {/* Facebook */}
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://ais-pre-ircpwuehdczjjtvto6qsow-649656015455.asia-southeast1.run.app")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100/60 transition text-center group no-underline"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition-all">
                      f
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Facebook</span>
                  </a>

                  {/* LinkedIn */}
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://ais-pre-ircpwuehdczjjtvto6qsow-649656015455.asia-southeast1.run.app")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-100/60 transition text-center group no-underline"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs mb-1.5 shadow-sm group-hover:scale-105 transition-all">
                      in
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">LinkedIn</span>
                  </a>

                  {/* Native Mobile Share */}
                  <button 
                    type="button"
                    onClick={handleNativeShare}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-100/60 transition text-center group cursor-pointer outline-none border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs mb-1.5 shadow-sm group-hover:scale-105 transition-all">
                      🔗
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Other Share</span>
                  </button>
                </div>

                {/* Copyable text space */}
                <div className="space-y-1.5 pt-3.5 border-t border-slate-100">
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Copy Link Share</span>
                  <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 items-center">
                    <span className="text-[11px] font-mono font-bold text-slate-600 truncate flex-1 px-2 text-left">
                      https://ais-pre-ircpwuehdczjjtvto6qsow-649656015455.asia-southeast1.run.app
                    </span>
                    <button 
                      type="button"
                      onClick={handleCopyLink}
                      className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer outline-none border-0"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3 h-3 text-teal-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* QR Code section */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-250 shrink-0 select-none">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://ais-pre-ircpwuehdczjjtvto6qsow-649656015455.asia-southeast1.run.app")}`} 
                    alt="QR Share" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left leading-normal">
                  <span className="text-[9px] font-black uppercase text-teal-700 bg-teal-50 border border-teal-150 px-2 py-0.5 rounded tracking-wider inline-block">Mobile Link QR</span>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">Apne mobile se scan karke directly skin diagnostic scanner use karein.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* LIGHTBOX FOR PROFILE PHOTO / SKIN SCAN PREVIEW */}
        {selectedScanImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6 border border-slate-200 shadow-2xl relative text-left mx-4 text-slate-850">
              
              <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 mb-4">
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                  High-Resolution Visual Inspection
                </h3>
                <button 
                  type="button"
                  onClick={() => setSelectedScanImageModal(null)}
                  className="text-slate-400 hover:text-slate-700 font-black text-xl hover:bg-slate-150 h-8 w-8 rounded-full flex items-center justify-center transition cursor-pointer bg-transparent border-0 outline-none"
                >
                  ×
                </button>
              </div>

              <div className="w-full h-96 rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-200 shadow-inner">
                <img src={selectedScanImageModal} className="max-w-full max-h-full object-contain" alt="Enlarged visual diagnostic" />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = selectedScanImageModal;
                    link.download = "glowai_clinical_image.jpg";
                    link.click();
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer"
                >
                  Download Image File
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScanImageModal(null)}
                  className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  </div>
  );
}
