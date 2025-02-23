import { Chunk } from "@/core/domain/chunk";

export interface ChunkRepo {
  findBySourceIdAndSimilarity(sourceId: string, similarity: number): Promise<Chunk[]>
}