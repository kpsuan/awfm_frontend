import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Menu,
  User,
  Users,
  Info,
  Video,
  Mic,
  FileText,
  Play,
  Trash2,
  Heart,
  MessageSquare,
  CheckCircle,
  Settings,
  UserPlus,
  LogOut,
  LayoutGrid,
  List,
  Share2,
  Bell,
  Lock,
  Eye,
  Link,
  Mail,
  Copy,
  MapPin,
  CheckCheck
} from 'lucide-react';

// Re-export Lucide icons with consistent naming
export const ArrowLeftIcon = ({ size = 24, color = 'currentColor' }) => (
  <ArrowLeft size={size} color={color} />
);

export const ArrowRightIcon = ({ size = 24, color = 'currentColor' }) => (
  <ArrowRight size={size} color={color} />
);

export const CheckIcon = ({ size = 24, color = 'currentColor' }) => (
  <Check size={size} color={color} />
);

export const CloseIcon = ({ size = 24, color = 'currentColor' }) => (
  <X size={size} color={color} />
);

export const ChevronDownIcon = ({ size = 24, color = 'currentColor' }) => (
  <ChevronDown size={size} color={color} />
);

export const ChevronUpIcon = ({ size = 24, color = 'currentColor' }) => (
  <ChevronUp size={size} color={color} />
);

export const MenuIcon = ({ size = 24, color = 'currentColor' }) => (
  <Menu size={size} color={color} />
);

export const UserIcon = ({ size = 24, color = 'currentColor' }) => (
  <User size={size} color={color} />
);

export const InfoIcon = ({ size = 24, color = 'currentColor' }) => (
  <Info size={size} color={color} />
);

// Media Icons
export const VideoIcon = ({ size = 20, color = 'currentColor' }) => (
  <Video size={size} color={color} />
);

export const MicIcon = ({ size = 20, color = 'currentColor' }) => (
  <Mic size={size} color={color} />
);

export const TextIcon = ({ size = 20, color = 'currentColor' }) => (
  <FileText size={size} color={color} />
);

export const PlayIcon = ({ size = 24, color = 'currentColor' }) => (
  <Play size={size} color={color} fill={color} />
);

// Action Icons
export const TrashIcon = ({ size = 18, color = 'currentColor' }) => (
  <Trash2 size={size} color={color} />
);

export const HeartIcon = ({ size = 18, color = 'currentColor', filled = false }) => (
  <Heart size={size} color={color} fill={filled ? color : 'none'} />
);

export const CommentIcon = ({ size = 18, color = 'currentColor' }) => (
  <MessageSquare size={size} color={color} />
);

export const CheckCircleIcon = ({ size = 18, color = 'currentColor' }) => (
  <CheckCircle size={size} color={color} />
);

export const SettingsIcon = ({ size = 18, color = 'currentColor' }) => (
  <Settings size={size} color={color} />
);

export const UserPlusIcon = ({ size = 18, color = 'currentColor' }) => (
  <UserPlus size={size} color={color} />
);

export const LogOutIcon = ({ size = 18, color = 'currentColor' }) => (
  <LogOut size={size} color={color} />
);

// View Icons
export const GridIcon = ({ size = 20, color = 'currentColor' }) => (
  <LayoutGrid size={size} color={color} />
);

export const ListIcon = ({ size = 20, color = 'currentColor' }) => (
  <List size={size} color={color} />
);

// Social/Share Icons
export const ShareIcon = ({ size = 18, color = 'currentColor' }) => (
  <Share2 size={size} color={color} />
);

export const BellIcon = ({ size = 18, color = 'currentColor' }) => (
  <Bell size={size} color={color} />
);

export const LockIcon = ({ size = 18, color = 'currentColor' }) => (
  <Lock size={size} color={color} />
);

export const EyeIcon = ({ size = 18, color = 'currentColor' }) => (
  <Eye size={size} color={color} />
);

export const UsersIcon = ({ size = 18, color = 'currentColor' }) => (
  <Users size={size} color={color} />
);

export const LinkIcon = ({ size = 18, color = 'currentColor' }) => (
  <Link size={size} color={color} />
);

export const MailIcon = ({ size = 18, color = 'currentColor' }) => (
  <Mail size={size} color={color} />
);

export const CopyIcon = ({ size = 18, color = 'currentColor' }) => (
  <Copy size={size} color={color} />
);

export const MapPinIcon = ({ size = 18, color = 'currentColor' }) => (
  <MapPin size={size} color={color} />
);

export const CheckCheckIcon = ({ size = 18, color = 'currentColor' }) => (
  <CheckCheck size={size} color={color} />
);

// Helper to get recording type icon
export const getRecordingTypeIcon = (type, size = 20) => {
  switch (type) {
    case 'video': return <VideoIcon size={size} />;
    case 'audio': return <MicIcon size={size} />;
    case 'text': return <TextIcon size={size} />;
    default: return null;
  }
};
