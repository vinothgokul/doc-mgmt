import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { DatabaseService } from '../database/database.service';
import { ForbiddenException } from '@nestjs/common';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let databaseService: DeepMockProxy<DatabaseService>;

  let mockFile: Express.Multer.File;
  let mockDocument: any;
  let mockIngestionProcess: any;

  beforeEach(async () => {
    databaseService = mockDeep<DatabaseService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: DatabaseService,
          useValue: databaseService
        }
      ],
    }).compile();

    documentService = module.get<DocumentService>(DocumentService);

    mockFile = { path: 'uploads/test-file.pdf' } as Express.Multer.File;
    mockDocument = { id: 1, title: 'Test Doc', filePath: mockFile.path };
    mockIngestionProcess = { id: 1, documentId: mockDocument.id };
  });

  describe('create', () => {
    it('should create a document', async () => {
      databaseService.document.create.mockResolvedValue(mockDocument);

      const result = await documentService.create(mockDocument.title, mockFile);

      expect(databaseService.document.create).toHaveBeenCalledWith({
        data: { title: mockDocument.title, filePath: mockFile.path },
      });
      expect(result).toEqual(mockDocument);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      databaseService.document.findMany.mockResolvedValue([mockDocument]);

      const result = await documentService.findAll();

      expect(databaseService.document.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockDocument]);
    });
    it('should throw ForbiddenException if no documents exist', async () => {
      databaseService.document.findMany.mockResolvedValue([]);
  
      await expect(documentService.findAll()).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('should return a document if it exists', async () => {
      databaseService.document.findUnique.mockResolvedValue(mockDocument);

      const result = await documentService.findOne(mockDocument.id);

      expect(databaseService.document.findUnique).toHaveBeenCalledWith({
        where: { id: mockDocument.id },
      });
      expect(result).toEqual(mockDocument);
    });

    it('should throw ForbiddenException if document does not exist', async () => {
      databaseService.document.findUnique.mockResolvedValue(null);

      await expect(documentService.findOne(mockDocument.id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      databaseService.document.findUnique.mockResolvedValue(mockDocument);
      databaseService.document.update.mockResolvedValue(mockDocument);

      const result = await documentService.update(mockDocument.id, 'Updated Title', mockFile);

      expect(databaseService.document.update).toHaveBeenCalledWith({
        where: { id: mockDocument.id },
        data: { title: 'Updated Title', filePath: mockFile.path },
      });
      expect(result).toEqual(mockDocument);
    });

    it('should throw ForbiddenException if document does not exist', async () => {
      databaseService.document.findUnique.mockResolvedValue(null);

      await expect(documentService.update(mockDocument.id, 'Updated Title', mockFile)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a document', async () => {
      databaseService.document.findUnique.mockResolvedValue(mockDocument);
      databaseService.document.delete.mockResolvedValue(mockDocument);

      const result = await documentService.remove(mockDocument.id);

      expect(databaseService.document.delete).toHaveBeenCalledWith({
        where: { id: mockDocument.id },
      });
      expect(result).toEqual(mockDocument);
    });

    it('should throw ForbiddenException if document does not exist', async () => {
      databaseService.document.findUnique.mockResolvedValue(null);

      await expect(documentService.remove(mockDocument.id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('triggerIngestion', () => {
    it('should trigger an ingestion process', async () => {
      databaseService.document.findUnique.mockResolvedValue(mockDocument);
      databaseService.ingestionProcess.create.mockResolvedValue(mockIngestionProcess);

      const result = await documentService.triggerIngestion(mockDocument.id);

      expect(databaseService.ingestionProcess.create).toHaveBeenCalledWith({
        data: { documentId: mockDocument.id },
      });
      expect(result).toEqual(mockIngestionProcess);
    });

    it('should throw ForbiddenException if document does not exist', async () => {
      databaseService.document.findUnique.mockResolvedValue(null);

      await expect(documentService.triggerIngestion(mockDocument.id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getIngestionStatus', () => {
    it('should return ingestion process status', async () => {
      databaseService.ingestionProcess.findUnique.mockResolvedValue(mockIngestionProcess);

      const result = await documentService.getIngestionStatus(mockIngestionProcess.id);

      expect(databaseService.ingestionProcess.findUnique).toHaveBeenCalledWith({
        where: { id: mockIngestionProcess.id },
      });
      expect(result).toEqual(mockIngestionProcess);
    });

    it('should throw ForbiddenException if ingestion process does not exist', async () => {
      databaseService.ingestionProcess.findUnique.mockResolvedValue(null);

      await expect(documentService.getIngestionStatus(mockIngestionProcess.id)).rejects.toThrow(ForbiddenException);
    });
  });
});
