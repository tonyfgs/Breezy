export interface UpdateReportDTO {
    status: 'reviewed' | 'dismissed';
    moderatorId: string;
}
