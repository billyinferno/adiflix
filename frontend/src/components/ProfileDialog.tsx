import {
    // useEffect,
    // useRef,
useState,
} from 'react';
import { useChangePassword } from '@pelagica/core';
import {
    User,
    // Upload,
    Eye,
    EyeOff,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentUser?: {
        userId?: string;
        name?: string;
        avatarUrl?: string;
    };
}

export function ProfileDialog({ open, onOpenChange, currentUser }: ProfileDialogProps) {
    const { mutateAsync: changePassword, isPending, error: mutationError } = useChangePassword();
    // const fileInputRef = useRef<HTMLInputElement>(null);

    const [username, setUsername] = useState(currentUser?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Local state for image file and preview URL
    // const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
    // const avatarSrc = localPreviewUrl || currentUser?.avatarUrl || '';
    const avatarSrc = currentUser?.avatarUrl || '';

    // const handleTriggerFileSelect = (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     fileInputRef.current?.click();
    // };
    

    // Clean up Blob URLs to prevent memory leaks
    // useEffect(() => {
    //     return () => {
    //         if (localPreviewUrl?.startsWith('blob:')) {
    //             URL.revokeObjectURL(localPreviewUrl);
    //         }
    //     };
    // }, [localPreviewUrl]);

    // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         setSelectedFile(file);
    //         const imageUrl = URL.createObjectURL(file);
    //         setLocalPreviewUrl(imageUrl);
    //     }
    //     // Reset input value so re-selecting the same file triggers onChange
    //     e.target.value = '';
    // };

    const handleReset = () => {
        setUsername(currentUser?.name || '');
        // setLocalPreviewUrl(null);
        setCurrentPassword('');
        setNewPassword('');
        setRetypePassword('');
        setValidationError(null);
    };

    const handleClose = () => {
        handleReset();
        onOpenChange(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (newPassword && newPassword !== retypePassword) {
            setValidationError('New passwords do not match');
            return;
        }

        if (newPassword && !currentPassword) {
            setValidationError('Current password is required to set a new password');
            return;
        }

        try {
            if (newPassword) {
                await changePassword({
                    userId: (currentUser?.userId ?? ''),
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                });
            }

            //TODO: to handle avatar upload if selectedFile is not null
            handleClose();
        } catch {
            // already catch by mutationError
        }
    };
    
    const activeError = validationError || (mutationError instanceof Error ? mutationError.message : null);

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent
                className="sm:max-w-[425px]"
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{'Edit Profile'}</DialogTitle>
                </DialogHeader>

                {/* <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    onClick={(e) => e.stopPropagation()}
                /> */}

                {/* Render error banner if activeError exists */}

                <form onSubmit={handleSave} className="space-y-4 py-2">
                    {activeError && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                            {activeError}
                        </div>
                    )}

                    {/* 1. User Avatar */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative group">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={avatarSrc} alt={username} />
                                <AvatarFallback>
                                    <User className="w-10 h-10 text-gray-400" />
                                </AvatarFallback>
                            </Avatar>
                            {/* <button
                                type="button"
                                onClick={handleTriggerFileSelect}
                                className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                                title={'Click to change avatar'}
                            >
                                <Upload className="w-5 h-5" />
                            </button> */}
                        </div>
                        {/* <span className="text-xs text-gray-400">
                            {'Click image to upload avatar'}
                        </span> */}
                    </div>

                    {/* 2. User Name */}
                    <div className="space-y-1.5">
                        <div className="text-center">
                            <h3 className="font-semibold text-lg text-gray-100">{currentUser?.name}</h3>
                        </div>
                        <Input
                            id="username"
                            value={username}
                            placeholder="Username"
                            disabled
                            className="hidden bg-muted text-muted-foreground cursor-not-allowed"
                        />
                    </div>

                    {/* 3. Current Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="current-password">
                            {'Current Password'}
                        </Label>
                        <div className="relative">
                            <Input
                                id="current-password"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* 4. New Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="new-password">
                            {'New Password'}
                        </Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* 5. Retype New Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="retype-password">
                            {'Retype New Password'}
                        </Label>
                        <Input
                            id="retype-password"
                            type="password"
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {/* 6 & 7. Save and Cancel Buttons */}
                    <DialogFooter className="pt-4 gap-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            {'Cancel'}
                        </Button>
                        <Button type="submit" disabled={isPending} variant="adiflixOther">
                            {isPending ? 'Updating...' : 'Update Password'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}