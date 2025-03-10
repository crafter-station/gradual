import { useCase } from '@/core/usecases/container';
import { CreateAlternativeStepsUseCase } from '@/core/usecases/create-alternative-steps.usecase';

await useCase(CreateAlternativeStepsUseCase).execute(
  '0407c555-8e82-4050-a604-7fe256e510f4',
  5,
  'It only matters for short-term loans',
);
