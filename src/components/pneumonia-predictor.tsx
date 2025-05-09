
"use client";

import { useState, ChangeEvent, FormEvent, DragEvent } from 'react';
import Image from 'next/image';
import { pneumoniaPrediction, type PneumoniaPredictionOutput } from '@/ai/flows/pneumonia-prediction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileScan, Loader2, AlertTriangle, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PneumoniaPredictor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PneumoniaPredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const processFile = (file: File | undefined | null) => {
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      if (file.size > 10 * 1024 * 1024) {
          setError("File is too large. Maximum size is 10MB.");
          setSelectedFile(null);
          setPreviewUrl(null);
          return;
      }
      setSelectedFile(file);
      setPredictionResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      if (file) {
        setError("Invalid file type. Please upload a PNG, JPG, or JPEG image.");
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);
    if (event.target) {
      event.target.value = ""; 
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const result = await pneumoniaPrediction({ imageFile: selectedFile });
      setPredictionResult(result);
    } catch (e) {
      console.error("Prediction error:", e);
      let errorMessage = "An unknown error occurred during prediction.";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      if (errorMessage && !errorMessage.includes("Server response:") && (e as any)?.cause) {
         errorMessage += ` Details: ${ (e as any).cause}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const dropzone = e.currentTarget;
    if (!dropzone.contains(e.relatedTarget as Node)) {
        setIsDraggingOver(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl flex items-center">
          <FileScan className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-primary" />
          Pneumonia Detection
        </CardTitle>
        <CardDescription>
          Upload a chest X-ray image to predict the likelihood of pneumonia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="xray-upload-input" className="text-base">Upload X-Ray Image</Label>
            <div
              id="dropzone"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('xray-upload-input')?.click()}
              className={cn(
                "mt-1 flex justify-center items-center border-2 border-dashed rounded-md cursor-pointer transition-colors duration-200 ease-in-out overflow-hidden",
                // Dragging state
                isDraggingOver 
                  ? `border-primary bg-accent ${previewUrl ? 'p-1 aspect-[16/10]' : 'flex-col px-6 pt-5 pb-6 h-48 sm:h-64'}`
                  : [ // Not dragging
                      previewUrl 
                        ? "p-1 aspect-[16/10] border-input hover:border-primary/70" // Preview shown
                        : [ // No preview
                            "flex-col px-6 pt-5 pb-6 h-48 sm:h-64 border-input hover:border-primary/70",
                            selectedFile && "border-primary bg-primary/5" // File selected, no preview
                          ]
                    ]
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('xray-upload-input')?.click();}}
              aria-label="Image upload dropzone"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="X-Ray Preview"
                  width={500} 
                  height={500} 
                  className="rounded-md object-contain w-full h-full"
                  data-ai-hint="xray lung"
                />
              ) : (
                <div className="space-y-1 text-center">
                  <UploadCloud className={cn("mx-auto h-12 w-12", isDraggingOver ? "text-primary" : "text-muted-foreground")} />
                  <div className="flex text-sm text-muted-foreground items-center justify-center">
                    <Label
                      htmlFor="xray-upload-input"
                      className={cn(
                          "relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                          isDraggingOver ? "text-accent-foreground" : ""
                      )}
                    >
                      <span>Upload a file</span>
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, JPEG up to 10MB</p>
                </div>
              )}
              <Input
                id="xray-upload-input"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>
            {selectedFile && (
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
          
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || !selectedFile}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              "Predict Pneumonia"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {predictionResult && !error && (
          <Card className="mt-6 bg-background shadow-md">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl flex items-center">
                <FlaskConical className="w-6 h-6 mr-2 text-primary" />
                Prediction Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base">
              <p>
                <strong>Predicted Class:</strong>
                <span className={`ml-2 font-semibold ${predictionResult.predicted_class === 'PNEUMONIA' ? 'text-destructive' : 'text-green-600'}`}>
                  {predictionResult.predicted_class}
                </span>
              </p>
              <p>
                <strong>Confidence:</strong>
                <span className="ml-2 font-semibold">
                  {typeof predictionResult.confidence === 'number' ? predictionResult.confidence.toFixed(2) : 'N/A'}%
                </span>
              </p>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    This is an AI-generated prediction and not a substitute for professional medical advice.
                </p>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
