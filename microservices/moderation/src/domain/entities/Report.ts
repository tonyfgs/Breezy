export class Report {
    id?: string;
    reporterId: string;
    targetId: string;
    targetType: 'post' | 'user';
    reason: string;
    status: 'pending' | 'reviewed' | 'dismissed';
    moderatorId: string | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        reporterId: string,
        targetId: string,
        targetType: 'post' | 'user',
        reason: string,
        id?: string
    ) {
        this.id = id;
        this.reporterId = reporterId;
        this.targetId = targetId;
        this.targetType = targetType;
        this.reason = reason;
        this.status = 'pending';
        this.moderatorId = null;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
