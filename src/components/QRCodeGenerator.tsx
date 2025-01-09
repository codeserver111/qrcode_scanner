"use client";

// React imports
import { useState, useRef, SetStateAction } from 'react';
import { useToast } from '@/hooks/use-toast';

// Third-party imports
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Download, RefreshCw, Eye } from 'lucide-react';

// UI Component imports
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [level, setLevel] = useState('L');
  const [downloading, setDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const downloadQRCode = async (format: 'png' | 'svg') => {
    if (!qrRef.current) return;

    setDownloading(true);
    let objectUrl: string | null = null;

    try {
      const canvas = qrRef.current.querySelector('canvas') as HTMLCanvasElement | null;
      const svg = qrRef.current.querySelector('svg') as SVGElement | null;
      const element = format === 'png' ? canvas : svg;
      
      if (!element) {
        throw new Error('QR Code element not found');
      }

      let downloadUrl: string;
      if (format === 'png' && canvas) {
        downloadUrl = canvas.toDataURL('image/png');
      } else if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        downloadUrl = objectUrl = URL.createObjectURL(svgBlob);
      } else {
        throw new Error('Failed to generate download URL');
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `qrcode.${format}`;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: `QR Code downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Error",
        description: "Failed to download QR Code",
        variant: "destructive",
      });
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl"
    >
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">URL or Text</Label>
              <Input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL or text"
                className="w-full"
              />
            </div>

            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                <div className="space-y-2">
                  <Label>Foreground Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <div
                          className="h-4 w-4 rounded mr-2"
                          style={{ backgroundColor: fgColor }}
                        />
                        {fgColor}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <HexColorPicker color={fgColor} onChange={setFgColor} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <div
                          className="h-4 w-4 rounded mr-2"
                          style={{ backgroundColor: bgColor }}
                        />
                        {bgColor}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <HexColorPicker color={bgColor} onChange={setBgColor} />
                    </PopoverContent>
                  </Popover>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Slider
                    value={[size]}
                    onValueChange={(value: SetStateAction<number>[]) => setSize(value[0])}
                    min={128}
                    max={512}
                    step={8}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">{size}px</span>
                </div>

                <div className="space-y-2">
                  <Label>Error Correction Level</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['L', 'M', 'Q', 'H'] as const).map((l) => (
                      <Button
                        key={l}
                        variant={level === l ? 'default' : 'outline'}
                        onClick={() => setLevel(l)}
                        className="w-full"
                      >
                        {l}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>QR Code Preview</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center p-6">
                <QRCodeSVG
                  value={url}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={level as "L" | "M" | "Q" | "H"}
                  includeMargin={includeMargin}
                />
                </div>
              </DialogContent>
              </Dialog>

              <Button
              onClick={() => downloadQRCode('png')}
              className="flex-1"
              disabled={downloading}
              >
                {downloading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download PNG
              </Button>
              <Button
                onClick={() => downloadQRCode('svg')}
                variant="outline"
                className="flex-1"
                disabled={downloading}
              >
                {downloading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download SVG
              </Button>
            </div>
          </div>

          <div
            ref={qrRef}
            className="flex items-center justify-center bg-white rounded-lg p-4"
          >
            <motion.div
              key={`${url}-${fgColor}-${bgColor}-${size}-${level}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
                <QRCodeCanvas
                value={url}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level={level as "L" | "M" | "Q" | "H"}
                includeMargin={includeMargin}
                />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default QRCodeGenerator;