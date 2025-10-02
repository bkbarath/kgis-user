import { useEffect, useRef, type ReactNode } from "react";
import IconComponent from "../../assets/icons/IconComponent";
import DotLoader from "./DotLoader";
import { useFileUploadContext } from "../../context/FileUploadContext";
import { convertKbToMB } from "../../utils/functional.util";

const FileUploadProgressContainer = () => {
  const { fileUploadProgress } = useFileUploadContext();

  const uploadingRef = useRef<HTMLDivElement>(null);

  // function to get icon colors
  const getColors = (percentage: number) => {
    if (percentage === 100) {
      return {
        bg: "bg-success-background/50",
        icon: "text-success-foreground",
      };
    }
    return {
      bg: "bg-info-background/50",
      icon: "text-info-foreground",
    };
  };

  // Scroll into view the first uploading item
  useEffect(() => {
    if (uploadingRef.current) {
      uploadingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [fileUploadProgress]); // triggers scroll when upload progresses

  const fileCategories = {
    file: ["pdf", "doc", "docx", "txt", "xls", "xlsx"],
    image: ["jpg", "jpeg", "png", "gif", "webp"],
  };

  const getIconBasedOnCategory = (name: string): ReactNode => {
    const lowercaseName = name.toLowerCase();

    const category = Object.entries(fileCategories)
      .map(([category, extensions]) => {
        if (extensions.some((ext) => lowercaseName.endsWith(ext))) {
          return category;
        }
        return null;
      })
      .filter(Boolean);
    if (category) {
      return <IconComponent iconName={category[0] ?? ""} className="min-w-7" />;
    }
  };

  let scrolled = false;
  return (
    <>
      {fileUploadProgress && Object.keys(fileUploadProgress)?.length > 0 && (
        <div className="fixed inset-0 z-50 h-full w-full items-center justify-center">
          <button className="absolute inset-0 h-full w-full bg-black opacity-50"></button>
          <div className="bg-background fixed top-1/2 left-1/2 flex max-h-7/10 w-8/10 -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-md p-3 md:w-1/2 lg:w-1/3">
            <div className="flex gap-1">
              Please wait, We are Uploading Your Files <DotLoader />
            </div>
            <div className="disable-scrollbar flex w-full flex-col gap-1 overflow-auto">
              {fileUploadProgress &&
                Object.entries(fileUploadProgress).map(([key]) => {
                  const currentFile = fileUploadProgress[key];
                  const isUploading = (currentFile?.percentage ?? 0) < 100;
                  const ref =
                    !scrolled && isUploading
                      ? ((scrolled = true), uploadingRef)
                      : null;
                  return (
                    <div
                      key={key}
                      ref={ref}
                      className="border-border-1 flex w-full items-center justify-start gap-2 rounded-lg border-1 p-1"
                    >
                      <div
                        className={`${
                          getColors(currentFile?.percentage).bg
                        } overflow-hidden rounded-xl p-1 min-h-8 min-w-8`}
                      >
                        <IconComponent
                          iconName={
                            currentFile.percentage === 100
                              ? "check"
                              : "fileUpload"
                          }
                          className={`${
                            getColors(currentFile?.percentage).icon
                          } ${
                            currentFile.percentage === 100
                              ? "ping-once"
                              : "upload"
                          }`}
                        />
                      </div>
                      <div className="flex w-full flex-col gap-1">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center text-sm">
                            {getIconBasedOnCategory(currentFile.file.name)}
                            <p className="line-clamp-1">
                              {currentFile?.media?.name}
                            </p>
                          </div>
                          {currentFile.percentage === 100 && (
                            <IconComponent
                              iconName="check"
                              className="text-status-success-1 text-[25px]"
                            />
                          )}
                        </div>
                        <div className="bg-secondary/20 h-3 w-full rounded-2xl">
                          <div
                            className={[
                              "from-gradient-from to-gradient-to h-full rounded-2xl bg-linear-to-r",
                              currentFile.percentage === 100 ? "" : "stripes",
                            ].join(" ")}
                            style={{ width: `${currentFile?.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex w-full justify-between">
                          {currentFile?.percentage === 100 ? (
                            <p className="text-xs">
                              File Uploaded Successfully
                            </p>
                          ) : (
                            <div className="flex gap-2 text-sm">
                              <div className="flex gap-1">
                                <p>
                                  {convertKbToMB(
                                    currentFile?.currentlyUploaded ?? 0
                                  )}
                                </p>
                                <p className="font-semibold">of</p>
                                <p>{convertKbToMB(currentFile?.file?.size)} </p>
                              </div>
                              <div className="flex gap-1">
                                File Uploading <DotLoader />
                              </div>
                            </div>
                          )}
                          <p className="text-sm">{currentFile?.percentage}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileUploadProgressContainer;
