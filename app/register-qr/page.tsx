"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, QrCode } from "lucide-react";
import { Header } from "@/components/header";

export default function RegisterQRPage() {
  const [registrationUrl, setRegistrationUrl] = useState("");

  useEffect(() => {
    // Get the full URL for the registration page
    const url = `${window.location.origin}/register`;
    setRegistrationUrl(url);
  }, []);

  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-accent bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8">
        <div className="w-full max-w-xl">
          <Card className="shadow-2xl border-2">
            <CardContent className="p-5">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="mx-auto w-10 aspect-square bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <QrCode className="h-6 aspect-square text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-4 text-foreground">
                  Event Registration
                </h1>
                <p className="text-lg text-muted-foreground">
                  Scan to Register for Lucky Draw
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-12">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  {registrationUrl ? (
                    <QRCodeSVG
                      value={registrationUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  ) : (
                    <div className="w-[400px] h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
                      <p className="text-gray-500">Loading QR Code...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-xl">
                  <div className="flex-shrink-0 w-8 aspect-square bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-base font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-2">
                      Open Camera
                    </h3>
                    <p className="text-base text-muted-foreground">
                      Open your phone's camera app
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-xl">
                  <div className="flex-shrink-0 w-8 aspect-square bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-base font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-2">
                      Scan QR Code
                    </h3>
                    <p className="text-base text-muted-foreground">
                      Point your camera at the QR code above
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-xl">
                  <div className="flex-shrink-0 w-8 aspect-square bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-2">Register</h3>
                    <p className="text-base text-muted-foreground">
                      Fill in your name to register
                    </p>
                  </div>
                </div>
              </div>

              {/* URL Display */}
              {!registrationUrl.includes("localhost") && (
                <div className="mt-12 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Or visit directly:
                  </p>
                  <p className="text-base font-mono bg-muted px-3 py-1.5 rounded-lg inline-block">
                    {registrationUrl || "Loading..."}
                  </p>
                </div>
              )}

              {/* Footer Icon */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-base">Scan with your smartphone</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
