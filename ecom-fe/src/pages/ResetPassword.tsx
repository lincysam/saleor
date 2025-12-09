// ResetPassword.tsx - Complete corrected version
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { RootState } from "@/redux/store";
import {
  setPasswordRequest,
  passwordResetRequest,
  clearAuthError,
} from "@/redux/auth/auth.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Mail,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<"request" | "reset">("request");
  const [resetEmail, setResetEmail] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (email && token) {
      setStep("reset");
      setResetEmail(email);
    }
  }, [email, token]);

  useEffect(() => {
    // Clear error when component mounts or when step changes
    dispatch(clearAuthError());
  }, [dispatch, step]);

  const handlePasswordResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }
    dispatch(passwordResetRequest(resetEmail));
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (email && token) {
      dispatch(
        setPasswordRequest({ email, token, password: formData.password })
      );
    }
  };

  // Handle reset request success
  useEffect(() => {
    if (step === "request" && !loading && !error && resetRequested) {
      toast.success("Password reset link sent! Please check your email.");
      setResetEmail("");
    }
  }, [loading, error, resetRequested, step]);

  // Handle password set success
  useEffect(() => {
    if (step === "reset" && !loading && !error) {
      setPasswordReset(true);
      toast.success(
        "Password reset successfully! You can now login with your new password."
      );

      // Auto-redirect after 3 seconds
      const timer = setTimeout(() => {
        navigate("/auth");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, error, step, navigate]);

  // Update resetRequested when loading state changes
  useEffect(() => {
    if (step === "request" && loading) {
      setResetRequested(true);
    }
  }, [loading, step]);

  if (step === "request") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-primary rounded-full p-3 w-fit mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {resetRequested && !loading && !error ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <p className="text-foreground font-medium">Check your email!</p>
                <p className="text-muted-foreground text-sm">
                  We've sent a password reset link to{" "}
                  <strong>{resetEmail}</strong>. Please check your inbox and
                  follow the instructions.
                </p>
                <p className="text-muted-foreground text-xs">
                  If you don't see the email, check your spam folder or try
                  again.
                </p>
                <div className="space-y-2 pt-2">
                  <Button asChild className="w-full">
                    <Link to="/auth">Back to Login</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setResetRequested(false);
                      setResetEmail("");
                    }}
                  >
                    Send Another Link
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordResetRequest} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link to="/auth">Back to Login</Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>

        <CardContent>
          {passwordReset ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <p className="text-foreground font-medium">
                Password Reset Successful!
              </p>
              <p className="text-muted-foreground text-sm">
                Your password has been reset successfully. You will be
                redirected to the login page shortly.
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">Go to Login Now</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link to="/auth">Back to Login</Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
