import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ForbiddenException } from '@nestjs/common';

describe('DocumentController', () => {
  let documentController: DocumentController;
  let documentService: DeepMockProxy<DocumentService>;

  let mockFile: Express.Multer.File;
  let mockDocument: any;
  let mockIngestionProcess: any;

  beforeEach(async () => {
    documentService = mockDeep<DocumentService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [{ provide: DocumentService, useValue: documentService }],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);

    mockFile = { path: 'uploads/test-file.pdf' } as Express.Multer.File;
    mockDocument = { id: 1, title: 'Test Doc', filePath: mockFile.path };
    mockIngestionProcess = { id: 1, documentId: mockDocument.id };
  });

  describe('create', () => {
    it('should upload and create a document', async () => {
      documentService.create.mockResolvedValue(mockDocument);

      const result = await documentController.create(mockFile, mockDocument.title);

      expect(documentService.create).toHaveBeenCalledWith(mockDocument.title, mockFile);
      expect(result).toEqual(mockDocument);
    });
  });
  describe('findAll', () => {
    it('should return all documents', async () => {
      documentService.findAll.mockResolvedValue([mockDocument]);

      const result = await documentController.findAll();

      expect(documentService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockDocument]);
    });

    it('should throw an exception if no documents exist', async () => {
      documentService.findAll.mockRejectedValue(new ForbiddenException('No documents found'));

      await expect(documentController.findAll()).rejects.toThrow(ForbiddenException);
    });
  });
  describe('findOne', () => {
    it('should return a document if it exists', async () => {
      documentService.findOne.mockResolvedValue(mockDocument);

      const result = await documentController.findOne(mockDocument.id);

      expect(documentService.findOne).toHaveBeenCalledWith(mockDocument.id);
      expect(result).toEqual(mockDocument);
    });

    it('should throw an exception if document does not exist', async () => {
      documentService.findOne.mockRejectedValue(new ForbiddenException('Document not found'));

      await expect(documentController.findOne(mockDocument.id)).rejects.toThrow(ForbiddenException);
    });
  });
  describe('update', () => {
    it('should update a document', async () => {
      documentService.update.mockResolvedValue(mockDocument);

      const result = await documentController.update(mockDocument.id, mockFile, 'Updated Title');

      expect(documentService.update).toHaveBeenCalledWith(mockDocument.id, 'Updated Title', mockFile);
      expect(result).toEqual(mockDocument);
    });

    it('should throw an exception if document does not exist', async () => {
      documentService.update.mockRejectedValue(new ForbiddenException('Document not found'));

      await expect(documentController.update(mockDocument.id, mockFile, 'Updated Title')).rejects.toThrow(ForbiddenException);
    });
  });
  describe('remove', () => {
    it('should delete a document', async () => {
      documentService.remove.mockResolvedValue(mockDocument);

      const result = await documentController.remove(mockDocument.id);

      expect(documentService.remove).toHaveBeenCalledWith(mockDocument.id);
      expect(result).toEqual(mockDocument);
    });

    it('should throw an exception if document does not exist', async () => {
      documentService.remove.mockRejectedValue(new ForbiddenException('Document not found'));

      await expect(documentController.remove(mockDocument.id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('triggerIngestion', () => {
    it('should trigger an ingestion process', async () => {
      documentService.triggerIngestion.mockResolvedValue(mockIngestionProcess);

      const result = await documentController.triggerIngestion(mockDocument.id);

      expect(documentService.triggerIngestion).toHaveBeenCalledWith(mockDocument.id);
      expect(result).toEqual(mockIngestionProcess);
    });

    it('should throw an exception if document does not exist', async () => {
      documentService.triggerIngestion.mockRejectedValue(new ForbiddenException('Document not found'));

      await expect(documentController.triggerIngestion(mockDocument.id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getIngestionStatus', () => {
    it('should return ingestion process status', async () => {
      documentService.getIngestionStatus.mockResolvedValue(mockIngestionProcess);

      const result = await documentController.getIngestionStatus(mockIngestionProcess.id);

      expect(documentService.getIngestionStatus).toHaveBeenCalledWith(mockIngestionProcess.id);
      expect(result).toEqual(mockIngestionProcess);
    });

    it('should throw an exception if ingestion process does not exist', async () => {
      documentService.getIngestionStatus.mockRejectedValue(new ForbiddenException('Ingestion Process not found'));

      await expect(documentController.getIngestionStatus(mockIngestionProcess.id)).rejects.toThrow(ForbiddenException);
    });
  });
});
