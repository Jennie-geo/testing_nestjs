import { ForbiddenException, Injectable, ParseIntPipe } from '@nestjs/common';
import { GetUser } from '../auth/decorators';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(UserId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        UserId,
        ...dto,
      },
    });
    return bookmark;
  }

  getBookmark(UserId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        UserId,
      },
    });
  }

  getBookmarkById(UserId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        UserId,
        id: bookmarkId,
      },
    });
  }

  async editBookMark(UserId: number, bookmarkId: number, dto: EditBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.UserId !== UserId)
      throw new ForbiddenException('Access to resources denial');

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: { ...dto },
    });
  }

  async deleteBookmark(UserId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.UserId !== UserId)
      throw new ForbiddenException('Access to resources denial');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
