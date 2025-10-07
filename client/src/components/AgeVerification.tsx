import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface AgeVerificationProps {
  onVerified: () => void;
}

export default function AgeVerification({ onVerified }: AgeVerificationProps) {
  const [showModal, setShowModal] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem('age_verified');
    if (!hasVerified) {
      setShowModal(true);
    } else {
      onVerified();
    }
  }, [onVerified]);

  const handleAccept = () => {
    localStorage.setItem('age_verified', 'true');
    setShowModal(false);
    onVerified();
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8">
          {!declined ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-primary mb-2">THE CHEATS</h1>
                <p className="text-sm text-muted-foreground">Illinois Lottery Tracker</p>
              </div>

              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-bold mb-3">Age Verification Required</h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      You must be 18 years or older to use this application.
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                  <p className="font-semibold">Important Information:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>This site provides lottery number analysis for educational and entertainment purposes only</li>
                    <li>We do not sell lottery tickets or facilitate gambling</li>
                    <li>This information is based on historical data and does not guarantee future results</li>
                    <li>Please play responsibly and within your means</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleAccept} 
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  I am 18 years or older - Enter Site
                </Button>
                <Button 
                  onClick={handleDecline} 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  I am under 18 - Exit
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
              <p className="text-muted-foreground mb-6">
                You must be 18 years or older to access this site. 
                Please come back when you meet the age requirement.
              </p>
              <p className="text-sm text-muted-foreground">
                If you believe this is an error, please refresh the page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


  if (!ageVerified) {
    return <AgeVerification onVerified={() => setAgeVerified(true)} />;
  }

  return (
    // Your normal app content here
    <div>
      {/* Your existing app code */}
    </div>
  );
}
