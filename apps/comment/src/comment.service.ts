import { Injectable } from '@nestjs/common';
import { Comment } from './entities';
import { Repository } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { ICreateComment, IUpdateComment } from './interface/comment.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentRepository: Repository<Comment>,
  ) {}

  generateUUID(): string {
    return uuid();
  }

  async addComment(comment: ICreateComment) {
    const comment_id = this.generateUUID();

    const newComment = await this.commentRepository.create({
      comment_id,
      ...comment,
    });

    return newComment;
  }

  async getAllCommentFilm(film_id: string) {
    const comments = await this.commentRepository.findAll({
      where: {
        film_id,
      },
      include: [
        {
          all: true,
          include: [
            {
              all: true,
              include: [
                {
                  all: true,
                  include: [
                    {
                      all: true,
                      include: [
                        {
                          all: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return comments.filter((comment: any) => comment.parent_id === null);
  }

  async getOneComment(comment_id: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        comment_id,
      },
      include: [
        {
          all: true,
          include: [
            {
              all: true,
              include: [
                {
                  all: true,
                  include: [
                    {
                      all: true,
                      include: [
                        {
                          all: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return comment;
  }

  async updateComment(comment_id: string, updateComment: IUpdateComment) {
    await this.commentRepository.update(
      { ...updateComment },
      { where: { comment_id } },
    );

    const comment = await this.getOneComment(comment_id);

    return comment;
  }

  async deleteComment(comment_id: string) {
    const checkComment = await this.getOneComment(comment_id);

    if (!checkComment) {
      return null;
    }

    await this.commentRepository.destroy({
      where: { comment_id },
      force: true,
    });

    return checkComment;
  }
}
