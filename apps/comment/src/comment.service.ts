import { Injectable } from '@nestjs/common';
import { Comment } from './entities';
import { Repository } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { ICreateComment, IUpdateComment } from './interface/comment.interface';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import { Profile, User } from '@app/shared';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentRepository: Repository<Comment>,
    @InjectModel(User) private userRepository: Repository<User>,
  ) {}

  private generateUUID(): string {
    return uuid();
  }

  async addComment(comment: ICreateComment) {
    const { user_id } = comment;

    if (!this.checkUUID(user_id)) {
      return 'user id is not uuid';
    }

    const checkUser = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!checkUser) {
      return 'user not found';
    }

    if (comment.hasOwnProperty('parent_id') && comment.parent_id !== null) {
      if (!this.checkUUID(comment.parent_id)) {
        return 'parent comment id is not uuid';
      }

      const checkComment = await this.commentRepository.findOne({
        where: { comment_id: comment.parent_id },
      });

      if (!checkComment) {
        return null;
      }
    }

    const comment_id = this.generateUUID();

    // const like = '36';

    const newComment = await this.commentRepository.create({
      comment_id,
      // like,
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
          model: User,
          attributes: ['email'],
          include: [
            {
              model: Profile,
              attributes: ['profile_id', 'first_name', 'last_name'],
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['email'],
              include: [
                {
                  model: Profile,
                  attributes: ['profile_id', 'first_name', 'last_name'],
                },
              ],
            },
            {
              model: Comment,
              include: [
                {
                  model: User,
                  attributes: ['email'],
                  include: [
                    {
                      model: Profile,
                      attributes: ['profile_id', 'first_name', 'last_name'],
                    },
                  ],
                },
                {
                  model: Comment,
                  include: [
                    {
                      model: User,
                      attributes: ['email'],
                      include: [
                        {
                          model: Profile,
                          attributes: ['profile_id', 'first_name', 'last_name'],
                        },
                      ],
                    },
                    {
                      model: Comment,
                      include: [
                        {
                          model: User,
                          attributes: ['email'],
                          include: [
                            {
                              model: Profile,
                              attributes: [
                                'profile_id',
                                'first_name',
                                'last_name',
                              ],
                            },
                          ],
                        },
                        {
                          model: Comment,
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
          model: User,
          attributes: ['email'],
          include: [
            {
              model: Profile,
              attributes: ['profile_id', 'first_name', 'last_name'],
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['email'],
              include: [
                {
                  model: Profile,
                  attributes: ['profile_id', 'first_name', 'last_name'],
                },
              ],
            },
            {
              model: Comment,
              include: [
                {
                  model: User,
                  attributes: ['email'],
                  include: [
                    {
                      model: Profile,
                      attributes: ['profile_id', 'first_name', 'last_name'],
                    },
                  ],
                },
                {
                  model: Comment,
                  include: [
                    {
                      model: User,
                      attributes: ['email'],
                      include: [
                        {
                          model: Profile,
                          attributes: ['profile_id', 'first_name', 'last_name'],
                        },
                      ],
                    },
                    {
                      model: Comment,
                      include: [
                        {
                          model: User,
                          attributes: ['email'],
                          include: [
                            {
                              model: Profile,
                              attributes: [
                                'profile_id',
                                'first_name',
                                'last_name',
                              ],
                            },
                          ],
                        },
                        {
                          model: Comment,
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

  private checkUUID(uuid: string) {
    return validator.isUUID(uuid);
  }
}
