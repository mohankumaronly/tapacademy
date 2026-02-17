import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    CheckCircle, 
    XCircle, 
    Loader2,
    Mail,
    ArrowRight,
    Briefcase,
    Users,
    Code2,
    Trophy,
    Sparkles,
    PartyPopper,
    AlertCircle
} from "lucide-react";

import { verifyEmail } from "../../services/auth.service";
import CommonLayout from "../../layouts/CommonLayout";
import Button from "../../common/Button";

const VerificationHandler = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token]);

  // Success stories (for demo)
  const successStories = [
    { user: "Alex Chen", role: "Frontend Dev", achievement: "just verified their email", time: "2m ago", avatar: "AC" },
    { user: "Sarah Johnson", role: "ML Engineer", achievement: "joined the community", time: "15m ago", avatar: "SJ" },
    { user: "Mike Peters", role: "DevOps", achievement: "completed profile setup", time: "1h ago", avatar: "MP" },
  ];

  return (
    <CommonLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-8 px-4"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Side - Community Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block space-y-6"
          >
            {/* Platform Header */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0a66c2] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">DevConnect</h1>
                <p className="text-sm text-slate-500">Where developers grow together</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0a66c2] rounded-xl flex items-center justify-center shadow-md">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Email Verification</h2>
                    <p className="text-sm text-slate-600">One last step to join our community</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-slate-600">
                  Verifying your email helps us maintain a secure and authentic community of developers. 
                  It also ensures you receive important updates about your projects and connections.
                </p>

                {/* Benefits */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5" />
                    <span className="text-xs text-slate-600">Secure account</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5" />
                    <span className="text-xs text-slate-600">Project updates</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5" />
                    <span className="text-xs text-slate-600">Community access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5" />
                    <span className="text-xs text-slate-600">Job notifications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Verifications Feed */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-[#0a66c2]" />
                  <h3 className="font-semibold text-sm">Recently Verified</h3>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {successStories.map((story, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {story.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-semibold text-sm">{story.user}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{story.role}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{story.achievement}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{story.time}</p>
                      </div>
                      <CheckCircle size={14} className="text-green-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>5,200+ developers</span>
              </div>
              <div className="flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                <span>500+ projects</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>98% verified</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Verification Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Progress Bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#0a66c2] to-blue-400" />
              
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#0a66c2] to-blue-500 rounded-2xl mb-3 shadow-lg shadow-blue-200"
                  >
                    {status === "loading" && <Mail className="w-6 h-6 text-white" />}
                    {status === "success" && <CheckCircle className="w-6 h-6 text-white" />}
                    {status === "error" && <XCircle className="w-6 h-6 text-white" />}
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-slate-800 mb-1 flex items-center justify-center gap-2">
                    Email Verification
                    {status === "success" && <Sparkles size={16} className="text-yellow-500" />}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {status === "loading" && "Verifying your email address..."}
                    {status === "success" && "Your email has been verified successfully"}
                    {status === "error" && "Verification failed or link expired"}
                  </p>
                </div>

                {/* Content based on status */}
                <div className="space-y-6">
                  {status === "loading" && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 size={48} className="text-[#0a66c2]" />
                      </motion.div>
                      <p className="text-sm text-slate-500 mt-4">
                        Please wait while we verify your email...
                      </p>
                    </div>
                  )}

                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                        <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                        <p className="text-green-700 font-medium text-sm">
                          Your email has been verified!
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          You can now log in to your account and start connecting with other developers.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-slate-700">What's next?</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-[#0a66c2] font-bold">1</span>
                            </div>
                            <span className="text-xs text-slate-600">Complete your developer profile</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-[#0a66c2] font-bold">2</span>
                            </div>
                            <span className="text-xs text-slate-600">Connect with other developers</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-[#0a66c2] font-bold">3</span>
                            </div>
                            <span className="text-xs text-slate-600">Share your first project</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        text="Go to Login"
                        type="button"
                        onClick={() => navigate("/auth/login")}
                        fullWidth
                        icon={ArrowRight}
                      />
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
                        <AlertCircle size={32} className="text-red-500 mx-auto mb-2" />
                        <p className="text-red-700 font-medium text-sm">
                          Verification failed
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          The verification link may have expired or is invalid.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-slate-700">Try these solutions:</h3>
                        <ul className="space-y-2 text-xs text-slate-600">
                          <li className="flex items-start gap-2">
                            <span className="text-[#0a66c2] font-bold">•</span>
                            <span>Request a new verification email</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#0a66c2] font-bold">•</span>
                            <span>Check if you're using the latest link</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#0a66c2] font-bold">•</span>
                            <span>Contact support for assistance</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <Button
                          text="Back to Login"
                          type="button"
                          onClick={() => navigate("/auth/login")}
                          fullWidth
                        />
                        <Button
                          text="Request New Link"
                          type="button"
                          onClick={() => navigate("/auth/verification-request")}
                          fullWidth
                          variant="outline"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Community Stats - Shows on mobile only */}
            <div className="mt-6 lg:hidden">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">5.2k</p>
                    <p className="text-[10px] text-slate-500">Developers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">500+</p>
                    <p className="text-[10px] text-slate-500">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">98%</p>
                    <p className="text-[10px] text-slate-500">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </CommonLayout>
  );
};

export default VerificationHandler;