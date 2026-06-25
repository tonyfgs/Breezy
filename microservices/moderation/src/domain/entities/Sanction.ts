export class Sanction {
    id?: string;
    targetId: string;
    targetType: 'post' | 'user';
    moderatorId: string;
    reportId: string | null;
    type: 'ban' | null;
    reason: string;
    fl_active: number;
    createdAt: Date;

    constructor(
        targetId: string,
        targetType: 'post' | 'user',
        moderatorId: string,
        reason: string,
        reportId: string | null = null,
        type: 'ban' | null = 'ban',
        id?: string
    ) {
        this.id = id;
        this.targetId = targetId;
        this.targetType = targetType;
        this.moderatorId = moderatorId;
        this.reason = reason;
        this.reportId = reportId;
        this.type = type;
        this.fl_active = 1;
        this.createdAt = new Date();
    }
}
