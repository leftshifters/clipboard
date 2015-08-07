import { Router } from 'express';
import Clips from './controllers/Clips';
// import upload from './controllers/Uplaod';


var router = new Router();

// Get all clips
router.get('/clips', Clips.index);

// router.post('/upload', [
//   upload.upload,
//   upload.thumb,
//   upload.diskspace,
//   upload.addSearchIndex
// ]);

export default router;
