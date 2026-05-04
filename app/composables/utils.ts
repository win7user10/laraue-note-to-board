export const useUtils = () => {
    const messagesFileApi = useRuntimeConfig().public.messagesBaseAddress + 'telegram-files/';
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
    });

    const timeFormatter = new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: 'numeric'
    });

    const formatDate = (dateString?: string) => {
        if (!dateString)
            return '';
        const date = new Date(dateString);
        const today = new Date();

        if (date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear())
            return timeFormatter.format(date);
        return dateFormatter.format(date);
    }

    const now = () => {
        return new Date().toISOString()
    }

    const getImageUrl = (id: string) => messagesFileApi + id

    const getRoleKey = (member: OrganizationMember) => {
        if (member.isOwner)
            return 'owner'
        if (member.accessLevel === ChildrenAccessLevel.Manage)
            return 'admin'
        return 'member'
    }

    const hasFlag = <T extends number>(currentValue: T, valueToCheck: T) => {
        return ((currentValue & valueToCheck) === valueToCheck);
    }

    const addFlag = <T extends number>(currentValue: T, valueToAdd: T) => {
        return (currentValue | valueToAdd) as T;
    }

    const deleteFlag = <T extends number>(currentValue: T, valueToAdd: T) => {
        return (currentValue & ~valueToAdd) as T;
    }

    return {
        formatDate,
        getImageUrl,
        now,
        getRoleKey,
        hasFlag,
        addFlag,
        deleteFlag,
    }
}