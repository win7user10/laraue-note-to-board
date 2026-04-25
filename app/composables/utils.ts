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

    const isPersonalOrg = (organization: OrganizationDto) => {
        return organization.id === 0;
    }

    const getRoleKey = (member: OrganizationMember) => {
        if (member.isOwner)
            return 'owner'
        if (member.accessLevel === AccessLevel.Manage)
            return 'admin'
        return 'member'
    }

    const hasFlag = (currentValue: AccessLevel, valueToCheck: AccessLevel) => {
        return ((currentValue & valueToCheck) === valueToCheck);
    }

    const addFlag = (currentValue: AccessLevel, valueToAdd: AccessLevel) => {
        currentValue |= valueToAdd;
        return currentValue;
    }

    const deleteFlag = (currentValue: AccessLevel, valueToAdd: AccessLevel) => {
        currentValue &= ~valueToAdd;
        return currentValue;
    }

    return {
        formatDate,
        getImageUrl,
        now,
        isPersonalOrg,
        getRoleKey,
        hasFlag,
        addFlag,
        deleteFlag,
    }
}