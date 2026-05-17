"use client";

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useRef } from "react";

export default function QRCodeDisplay({ link, businessName }: { link: string; businessName: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Create an SVG blob
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width + 100; // Add padding
      canvas.height = img.height + 150; // Add padding + text space
      
      if (ctx) {
        // Fill background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw QR
        ctx.drawImage(img, 50, 50);
        
        // Draw Text
        ctx.fillStyle = "black";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Scan to review ${businessName}`, canvas.width / 2, canvas.height - 40);
        
        // Create download link
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_${businessName.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  return (
    <Card className="flex flex-col items-center p-6">
      <CardHeader className="text-center w-full pb-8">
        <CardTitle>Your Custom QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8 w-full">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-zinc-100">
          <QRCodeSVG 
            id="qr-code-svg"
            value={link} 
            size={256} 
            level="H"
            includeMargin={true}
            ref={svgRef}
          />
        </div>
        <Button onClick={downloadQR} className="w-full max-w-[256px] gap-2">
          <Download className="w-4 h-4" /> Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
