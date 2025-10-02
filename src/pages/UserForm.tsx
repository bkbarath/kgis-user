import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type HTMLProps,
} from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  type Control,
  type FieldValues,
  type UseFormRegister,
} from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import IconComponent from "../assets/icons/IconComponent";
import {
  AutocompleteDropdown,
  Button,
  FileUpload,
  FileUploadProgressContainer,
  Input,
  Select,
  Textarea,
} from "../components/atoms";
import Alert from "../components/atoms/Alert";
import MultiSelectDropdown from "../components/atoms/MultiselectDropdown";
import { useFileUploadContext } from "../context/FileUploadContext";
import { UserFormFields } from "../lib/data/common.field";
import type { Document, UserModel } from "../lib/models/user.model";
import type { AlertType, FieldType } from "../lib/types/common.type";
import userService from "../services/user.api";
import {
  blobUrlToFile,
  calculateAge,
  getCurrentDateYYYYMMDD,
  uploadFileWithPercentage,
  usePreventUnload,
} from "../utils/functional.util";

export type MediaType = {
  file: string;
  name: string;
  field: string;
};

type Address = {
  type?: string;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode: number;
};

type FormValues = {
  username?: string;
  dob?: string;
  age?: number;
  gender?: string;
  languages?: string[];
  document?: MediaType[];
  photo?: MediaType;
  addresses: Address[];
};

// initial alert value
const initialAlert: AlertType = {
  open: false,
  message: "",
  status: "success",
};

const UserForm = () => {
  const { register, control, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        addresses: [{}],
      },
    });

  const [step, setStep] = useState<number>(0);
  const [mediaFiles, setMediaFiles] = useState<MediaType[]>([]);
  const totalSteps = UserFormFields.length;
  const { setFileUploadProgress } = useFileUploadContext();
  const [alert, setAlert] = useState<AlertType>(initialAlert); // state to handle alert popup open
  const navigate = useNavigate();
  const param = useParams();
  const location = useLocation();
  const [editUser, setEditUser] = useState<UserModel>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState(false);

  // call when user changes input
  useEffect(() => {
    if (watch()) setIsDirty(true); // if using react-hook-form
  }, [watch]);

  usePreventUnload(isDirty);

  const fetchUser = useCallback(async () => {
    if (param.id) {
      const data = await userService.getUserById(param.id);
      setEditUser(data);
    }
  }, [param.id]);

  useEffect(() => {
    const edit = location.pathname.includes("edit");
    if (edit) {
      setIsEdit(edit);
      fetchUser();
    }
  }, [fetchUser, location.pathname, param.id]);

  useEffect(() => {
    if (editUser) {
      reset(editUser);
      const documents: MediaType[] = (editUser.document ?? [])?.map((item) => ({
        field: "document",
        file: item.url ?? "",
        name: item.name ?? "",
      }));
      const photo: MediaType = {
        field: editUser.photo?.name ?? "",
        file: editUser.photo?.url ?? "",
        name: editUser.photo?.name ?? "",
      };

      setMediaFiles([...documents, photo]);
    }
  }, [editUser, reset]);

  const onSubmit = async (data: FormValues) => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      try {
        const values: UserModel = {
          ...(data as unknown as UserModel),
        };

        let uploadedFilesLink: Document[] = [];

        if (mediaFiles.length > 0) {
          uploadedFilesLink = await Promise.all(
            mediaFiles.map(async (item) => {
              // Already a Google Drive URL → return as Document
              if (
                item.file?.includes(import.meta.env.VITE_GDRIVE_URL) ||
                item.file?.includes(import.meta.env.VITE_DRIVE_DOMAIN_URL)
              ) {
                return {
                  name: item.name,
                  url: item.file,
                  uploadedAt: new Date().toISOString().split("T")[0],
                };
              }

              const path = `${values.id}/${item.field}`;

              if (item.file) {
                const file = await blobUrlToFile(
                  item.file,
                  `${item.name.replace(/\s+/g, "")}`
                );

                const data = await uploadFileWithPercentage(
                  item,
                  file,
                  path,
                  setFileUploadProgress,
                  item.field === "photo"
                );

                return {
                  name: item.field,
                  url: data ?? "",
                  uploadedAt: getCurrentDateYYYYMMDD(),
                };
              }

              // if no file, return a blank Document (or filter nulls later)
              return {
                name: item.field,
                url: "",
                uploadedAt: getCurrentDateYYYYMMDD(),
              };
            })
          );
        }

        setFileUploadProgress(null);

        const user: UserModel = {
          ...values,
          document: uploadedFilesLink.filter(
            (item) => item.name === "document"
          ),
          photo: uploadedFilesLink.find((item) => item.name === "photo"),
          createdAt: getCurrentDateYYYYMMDD(),
        };

        if (isEdit) {
          await userService.updateUserById(user.id ?? "", user).then(() => {
            setAlert({
              message: `User Updated Successfully`,
              status: "success",
              open: true,
            });
          });
        } else {
          await userService.createUser(user).then(() => {
            setAlert({
              message: `User Created Successfully`,
              status: "success",
              open: true,
            });
          });
        }
      } catch {
        setAlert({
          message: "Something Went Wrong",
          status: "danger",
          open: true,
        });
        setFileUploadProgress(null);
      }
    }
  };

  const dob = watch("dob");
  const languages = watch("languages");

  useEffect(() => {
    const age = calculateAge(dob ?? "");
    setValue("age", age);
  }, [dob, setValue]);

  const currentSection = UserFormFields[step];

  const handleImageSelection = (
    file: string,
    name: string,
    field: string
  ): void => {
    const newMedia = { file, name, field };
    setMediaFiles([...mediaFiles, newMedia]);
  };

  const removeFile = (name: string) => {
    setMediaFiles((prev) => prev.filter((file) => file.name !== name));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-grey-background">
      {/* File Upload Progress Container */}
      <FileUploadProgressContainer />

      {/* Alert Popup */}
      <Alert
        message={alert.message}
        onClose={() => {
          setAlert(initialAlert);
          navigate("/", { replace: true });
        }}
        open={alert.open}
        status={alert.status}
      />

      {/* back navigation button */}
      <Link
        to={"/"}
        title="Back to List"
        className="absolute top-2 left-2 cursor-pointer"
      >
        <IconComponent iconName={"back"} />
      </Link>
      <div className="absolute top-[2%] text-center">
        <p className="text-2xl font-semibold">
          {isEdit ? "User Update Form" : "User Creation Form"}
        </p>
        <p className="text-sm text-muted-foreground">
          {isEdit
            ? "Update existing user with their details"
            : "Create new user with their basic details"}
        </p>
      </div>

      {/* Actual Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full max-w-2xl max-h-[80vh] bg-background shadow rounded ${
          step === 2 && "overflow-auto"
        }`}
      >
        {/* Stepper Header */}
        <div className="flex justify-between mb-6 p-6 pb-0 sticky top-0 bg-background">
          <div className="flex items-center justify-between w-full gap-4">
            {UserFormFields.map((s, idx) => (
              <div
                key={s.field}
                className="flex flex-1 items-center justify-center gap-2 w-full"
              >
                {/* Circle */}
                <div
                  className={`min-w-8 h-8 rounded-full flex items-center justify-center 
                  ${
                    idx <= step
                      ? "bg-primary-purple text-background"
                      : "bg-muted-background text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </div>

                {/* Title */}
                <p
                  className={`w-full text-sm text-nowrap ${
                    idx === step ? "font-bold" : "text-gray-500"
                  }`}
                >
                  {s.title}
                </p>

                {/* Horizontal line (except for last item) */}
                {idx !== UserFormFields.length - 1 && (
                  <div className=" top-4 w-full h-0.5 bg-muted-background z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Current Section Fields */}
        <div className="grid grid-cols-1 gap-2 mb-4 px-6">
          {currentSection.multiple ? (
            <FieldArrayComponent
              control={control as unknown as Control<FieldValues, FieldValues>}
              register={register as unknown as UseFormRegister<FieldValues>}
              section={currentSection}
            />
          ) : (
            currentSection.fields.map((field) => {
              if (field.component === "select" && !field.multiple) {
                return (
                  <AutocompleteDropdown
                    options={field.options ?? []}
                    {...register(field.name as keyof FormValues)}
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    onChange={(value) =>
                      setValue(field.name as keyof FormValues, value as string)
                    }
                  />
                );
              }
              if (field.component === "select" && field.multiple) {
                return (
                  <MultiSelectDropdown
                    options={field.options ?? []}
                    value={languages}
                    onChange={(value) =>
                      setValue(field.name as keyof FormValues, value)
                    }
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                  />
                );
              }
              if (field.component === "textarea") {
                return (
                  <Textarea
                    key={field.name}
                    {...register(field.name as keyof FormValues)}
                    {...(field as HTMLProps<HTMLTextAreaElement>)}
                  />
                );
              }
              if (field.component === "file")
                return (
                  <div className="space-y-2">
                    {/* Common Label */}
                    {field.label && (
                      <h3 className="text-sm font-semibold">{field.label}</h3>
                    )}
                    {field.multiple ? (
                      <>
                        {mediaFiles.filter(
                          (media) => media.field === field.name
                        ).length < 3 && (
                          <FileUpload
                            accept={field.accept}
                            handleSelectFile={(file, name) =>
                              handleImageSelection(file, name, field.name ?? "")
                            }
                          />
                        )}
                        {Array.isArray(mediaFiles) &&
                          mediaFiles.filter(
                            (media) => media.field === field.name
                          ).length > 0 && (
                            <div className="space-y-3">
                              {mediaFiles
                                .filter((media) => media.field === field.name)
                                .map((file) => (
                                  <div
                                    key={file.name}
                                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                  >
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                        <IconComponent iconName="cancel" />
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {file.name}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(file.name);
                                      }}
                                      className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                    >
                                      <IconComponent iconName="cancel" />
                                    </button>
                                  </div>
                                ))}
                            </div>
                          )}
                      </>
                    ) : (
                      (() => {
                        const hasMediaFile = mediaFiles.find(
                          (media) => media.field === field.name
                        );
                        if (!hasMediaFile) {
                          return (
                            <FileUpload
                              accept={field.accept}
                              handleSelectFile={(file, name) =>
                                handleImageSelection(
                                  file,
                                  name,
                                  field.name ?? ""
                                )
                              }
                            />
                          );
                        }
                        return (
                          <div
                            key={hasMediaFile.name}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              {hasMediaFile.file ? (
                                <img
                                  src={hasMediaFile.file}
                                  alt={hasMediaFile.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                  <IconComponent iconName="cancel" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {hasMediaFile.name}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(hasMediaFile.name);
                              }}
                              className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                            >
                              <IconComponent iconName="cancel" />
                            </button>
                          </div>
                        );
                      })()
                    )}
                  </div>
                );
              return (
                <Input
                  key={field.name}
                  {...register(field.name as keyof FormValues)}
                  {...(field as HTMLProps<HTMLInputElement>)}
                />
              );
            })
          )}
        </div>
        {/* Navigation Buttons */}
        <div
          className={`flex p-6 sticky bottom-0 pt-0 ${
            step > 0 ? "justify-between" : "justify-end"
          }`}
        >
          {step > 0 && (
            <Button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 !bg-muted-background rounded text-foreground"
            >
              Previous
            </Button>
          )}
          <Button
            type="submit"
            className="px-4 py-2 bg-primary-purple text-background rounded"
          >
            {step === totalSteps - 1 ? (isEdit ? "Update" : "Submit") : "Next"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

type FieldArrayComponentProps = {
  section: FieldType;
  control: Control<FieldValues, FieldValues>;
  register: UseFormRegister<FieldValues>;
};

const FieldArrayComponent: FC<FieldArrayComponentProps> = ({
  section,
  control,
  register,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: section.field ?? "",
  });

  return (
    <div>
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 border rounded mb-4 space-y-2">
          {section.fields.map((field) => {
            const fieldName = `${section.field}[${index}].${field.name}`;

            if (field.component === "textarea")
              return (
                <Textarea
                  key={fieldName}
                  label={field.label}
                  {...register(fieldName)}
                  placeholder={field.label}
                />
              );

            if (field.component === "select")
              return (
                <Controller
                  key={fieldName}
                  name={fieldName}
                  control={control}
                  render={({ field: f }) => (
                    <Select
                      options={field.options}
                      addPlaceHolderValue
                      label={field.label}
                      placeholder={`Select ${field.label}`}
                      {...f}
                    />
                  )}
                />
              );

            return (
              <Input
                key={fieldName}
                {...register(fieldName)}
                label={field.label}
                placeholder={field.label}
              />
            );
          })}

          {index > 0 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 mt-2"
            >
              Remove Address
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({})}
        className="bg-primary-purple text-white px-4 py-2 rounded"
      >
        Add Address
      </button>
    </div>
  );
};
