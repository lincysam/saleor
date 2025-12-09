// // components/checkout/sections/Contact.tsx
// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useUser } from "@/hooks/useUser";
// import { Loader2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface ContactProps {
//   onEmailUpdate: (email: string) => void;
//   email?: string | null;
//   loading?: boolean;
// }

// export const Contact: React.FC<ContactProps> = ({
//   onEmailUpdate,
//   email,
//   loading = false,
// }) => {
//   const { user, authenticated } = useUser();
//   const navigate = useNavigate();
//   const [showLogin, setShowLogin] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       email: email || "",
//       createAccount: false,
//     },
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         // Only update email for guest checkout
//         onEmailUpdate(values.email);
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//   });

//   useEffect(() => {
//     if (email && email !== formik.values.email) {
//       formik.setFieldValue("email", email);
//     }
//   }, [email]);

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <h2 className="text-lg font-semibold mb-4">Contact details</h2>

//         {authenticated && user ? (
//           <div className="space-y-2">
//             <p className="text-sm">Signed in as {user.email}</p>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate("/auth?redirect=checkout")}
//             >
//               Sign out / Switch account
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <form onSubmit={formik.handleSubmit} className="space-y-4">
//               <div>
//                 <Label htmlFor="guest-email">Email *</Label>
//                 <Input
//                   id="guest-email"
//                   name="email"
//                   type="email"
//                   required
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   onBlur={() => {
//                     if (
//                       formik.values.email &&
//                       formik.values.email !== email
//                     ) {
//                       onEmailUpdate(formik.values.email);
//                     }
//                   }}
//                   placeholder="email@example.com"
//                   disabled={loading}
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="createAccount"
//                   checked={formik.values.createAccount}
//                   onCheckedChange={(checked) =>
//                     formik.setFieldValue("createAccount", checked)
//                   }
//                   disabled={loading}
//                 />
//                 <Label htmlFor="createAccount" className="text-sm">
//                   I want to create an account
//                 </Label>
//               </div>

              // <div className="pt-2">
              //   <p className="text-sm text-muted-foreground">
              //     Already have an account?{" "}
              //     <Button
              //       variant="link"
              //       className="p-0 h-auto"
              //       onClick={() =>
              //         navigate("/auth?redirect=checkout")
              //       }
              //       disabled={loading}
              //     >
              //       Sign in
              //     </Button>
              //   </p>
              // </div>

//                {/* <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={isLoading || loading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                     Continue
//                   </>
//                 ) : (
//                   "Continue"
//                 )}
//               </Button> */}
//             </form>
//            </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };





// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useFormik } from "formik";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Loader2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// import { RootState } from "@/redux/store";
// import { getCustomerAddressesRequest } from "@/redux/checkout/checkout.actions";

// interface ContactProps {
//   onEmailUpdate: (email: string) => void;
//   onUserAddressesFetched: (addresses: any) => void;
//   email?: string | null;
//   loading?: boolean;
// }

// export const Contact: React.FC<ContactProps> = ({
//   onEmailUpdate,
//   onUserAddressesFetched,
//   email,
//   loading = false,
// }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { customer } = useSelector((state: RootState) => state.checkout);
//   const [isCheckingEmail, setIsCheckingEmail] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       email: email || "",
//       createAccount: false,
//     },
//     onSubmit: async (values) => {
//       if (!values.email) return;
//       setIsCheckingEmail(true);

//       try {
//         // Dispatch saga to check if email is registered
//         dispatch(getCustomerAddressesRequest(values.email));
//       } finally {
//         setIsCheckingEmail(false);
//       }
//     },
//   });

//   // When customer data changes (from saga)
//   useEffect(() => {
//     if (customer.user) {

//       onEmailUpdate(customer.user.email);

//       // Prefill shipping/billing forms
//       onUserAddressesFetched({
//         defaultShipping: customer.user.defaultShippingAddress,
//         defaultBilling: customer.user.defaultBillingAddress,
//       });
//     } else if (customer.error) {
//       toast.error(customer.error);
//     }
//   }, [customer.user, customer.error]);

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <h2 className="text-lg font-semibold mb-4">Contact details</h2>

//         <form onSubmit={formik.handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="guest-email">Email *</Label>
//             <Input
//               id="guest-email"
//               name="email"
//               type="email"
//               required
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               placeholder="email@example.com"
//               disabled={loading || isCheckingEmail}
//             />
//           </div>

//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="createAccount"
//               checked={formik.values.createAccount}
//               onCheckedChange={(checked) =>
//                 formik.setFieldValue("createAccount", checked)
//               }
//               disabled={loading || isCheckingEmail}
//             />
//             <Label htmlFor="createAccount" className="text-sm">
//               I want to create an account
//             </Label>
//           </div>

//           <Button
//             type="submit"
//             className="w-full"
//             disabled={isCheckingEmail || loading}
//           >
//             {isCheckingEmail ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 Checking Email...
//               </>
//             ) : (
//               "Continue"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";

interface ContactProps {
  onEmailUpdate: (email: string) => void;
  email: string;
  loading: boolean;
  onUserAddressesFetched: (data: any) => void;
}

export const Contact: React.FC<ContactProps> = ({ onEmailUpdate, loading }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      onEmailUpdate(user.email);
    }
  }, [user?.email]);

  // ------------------------------------------
  // LOGGED-IN USER → Normal email form
  // ------------------------------------------
  if (user) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Contact details</h2>

          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                onEmailUpdate(e.target.value);
              }}
              placeholder="Enter contact email"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Using your account email. You can change it above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --------------------------------------------------
  // NOT LOGGED IN → Force login to proceed to checkout
  // --------------------------------------------------
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Contact details</h2>

        <p className="text-sm text-muted-foreground">
          You must sign in to continue checkout.
        </p>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate("/auth?redirect=checkout")}
              disabled={loading}
            >
              Sign in
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
