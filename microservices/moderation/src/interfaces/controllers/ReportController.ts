import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { IController } from './IController';
import { CreateReportUseCase } from '../../application/usecases/CreateReportUseCase';
import { GetReportUseCase } from '../../application/usecases/GetReportUseCase';
import { GetAllReportsUseCase } from '../../application/usecases/GetAllReportsUseCase';
import { UpdateReportUseCase } from '../../application/usecases/UpdateReportUseCase';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

export class ReportController implements IController {
    public readonly path = '/reports';
    public readonly router = Router();

    constructor(
        private readonly createReportUseCase: CreateReportUseCase,
        private readonly getReportUseCase: GetReportUseCase,
        private readonly getAllReportsUseCase: GetAllReportsUseCase,
        private readonly updateReportUseCase: UpdateReportUseCase,
    ) {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.post('/', authenticate, this.createReport.bind(this));
        this.router.get('/', authenticate, requireRole(['moderator', 'admin']), this.getAllReports.bind(this));
        this.router.get('/:id', authenticate, requireRole(['moderator', 'admin']), this.getReport.bind(this));
        this.router.patch('/:id', authenticate, requireRole(['moderator', 'admin']), this.updateReport.bind(this));
    }

    private async createReport(req: any, res: any): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = jwt.decode(token) as { profileId?: string } | null;
            if (decoded?.profileId) req.body.reporterId = decoded.profileId;
            const report = await this.createReportUseCase.execute(req.body);
            res.status(201).json(report);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    private async getAllReports(req: any, res: any): Promise<void> {
        try {
            const filters = {
                status: req.query.status as string | undefined,
                targetType: req.query.targetType as string | undefined,
            };
            const reports = await this.getAllReportsUseCase.execute(filters);
            res.status(200).json(reports);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    private async getReport(req: any, res: any): Promise<void> {
        try {
            const report = await this.getReportUseCase.execute(req.params.id);
            res.status(200).json(report);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }

    private async updateReport(req: any, res: any): Promise<void> {
        try {
            const report = await this.updateReportUseCase.execute(req.params.id, req.body);
            res.status(200).json(report);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }
}
