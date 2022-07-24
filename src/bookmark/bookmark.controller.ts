import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { getUser } from 'src/auth/decorators';
import { JwtGuards } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';

@UseGuards(JwtGuards)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Post()
  createBookmark(@getUser('id') userId: number) {}

  @Get()
  getBookmark(@getUser('id') userId: number) {}

  @Get()
  getBookmarkById(@getUser('id') userId: number) {}

  @Patch()
  editBookMark(@getUser('id') userId: number) {}

  @Delete()
  deleteBookmark(@getUser('id') userId: number) {}
}
