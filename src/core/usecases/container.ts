import { ResendMailSender } from '@/core/domain/mail-sender';
import { WaitRecordRepo } from '@/core/domain/wait-record-repo';
import { service } from '@/core/services/container';
import { CreateChunksServiceTask } from '@/core/services/create-chunks.service';
import { CreateCourseService } from '@/core/services/create-course.service';
import { CreateSourceServiceTask } from '@/core/services/create-source.service';
import { EnrichChunksServiceTask } from '@/core/services/enrich-chunk.service';
import { GenerateCourseSyllabusServiceTask } from '@/core/services/generate-course-syllabus.service';
import { GenerateLessonsStepsServiceTask } from '@/core/services/generate-lessons-steps.service';
import { GenerateSyllabusEmbeddingsServiceTask } from '@/core/services/generate-syllabus-embeddings.service';
import { ParseSourceServiceTask } from '@/core/services/parse-source.service';
import { StoreCourseServiceTask } from '@/core/services/store-course.service';
import { SumarizeChunksContentsServiceTask } from '@/core/services/summarize-chunk-content.service';
import { SummarizeSourceContentServiceTask } from '@/core/services/summarize-source-content.service';
import { CreateCourseUseCase } from '@/core/usecases/create-course.usecase';
import { JoinWaitlistUseCase } from './join-waitlist.usecase';
import { ListPendingWaitlistUseCase } from './list-pending-waitlist.usecase';

const waitRecordRepo = new WaitRecordRepo();
const mailSender = new ResendMailSender(process.env.RESEND_API_KEY as string);

const createCourseUseCase = new CreateCourseUseCase(
  service(ParseSourceServiceTask),
  service(CreateChunksServiceTask),
  service(CreateCourseService),
  service(CreateSourceServiceTask),
  service(EnrichChunksServiceTask),
  service(GenerateCourseSyllabusServiceTask),
  service(GenerateLessonsStepsServiceTask),
  service(GenerateSyllabusEmbeddingsServiceTask),
  service(StoreCourseServiceTask),
  service(SumarizeChunksContentsServiceTask),
  service(SummarizeSourceContentServiceTask),
);

const joinWaitlistUseCase = new JoinWaitlistUseCase(waitRecordRepo, mailSender);
const listPendingWaitlistUseCase = new ListPendingWaitlistUseCase(
  waitRecordRepo,
);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type UseCaseConstructor<T> = new (...args: any[]) => T;

export function useCase<T>(uc: UseCaseConstructor<T>): T {
  switch (uc) {
    case CreateCourseUseCase:
      return createCourseUseCase as T;
    case JoinWaitlistUseCase:
      return joinWaitlistUseCase as T;
    case ListPendingWaitlistUseCase:
      return listPendingWaitlistUseCase as T;
  }

  throw new Error(`UseCase not registered ${uc.name}`);
}
