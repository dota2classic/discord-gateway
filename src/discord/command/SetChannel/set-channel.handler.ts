import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {Logger} from '@nestjs/common';
import {SetChannelCommand} from "./set-channel.command";
import {ChannelModel} from "../../model/channel.model";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@CommandHandler(SetChannelCommand)
export class SetChannelHandler implements ICommandHandler<SetChannelCommand> {
  private readonly logger = new Logger(SetChannelHandler.name);

  constructor(
    @InjectRepository(ChannelModel)
    private readonly channelModelRepository: Repository<ChannelModel>,
  ) {}

  async execute(command: SetChannelCommand) {
    let c = await this.channelModelRepository.findOne({
      type: command.type,
    });
    if (!c) {
      c = new ChannelModel();
      c.type = command.type;
    }

    c.channelId = command.channelId;

    await this.channelModelRepository.save(c);
  }
}
