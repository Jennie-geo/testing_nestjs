import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { getUser } from 'src/auth/decorators';
import { JwtGuards } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuards)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Post()
  createBookmark(
    @getUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {}

  @Get()
  getBookmark(@getUser('id') userId: number) {}

  @Get(':id')
  getBookmarkById(
    @getUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {}

  @Patch()
  editBookMark(@getUser('id') userId: number, @Body() dto: EditBookmarkDto) {}

  @Delete(':id')
  deleteBookmark(
    @getUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {}
}
