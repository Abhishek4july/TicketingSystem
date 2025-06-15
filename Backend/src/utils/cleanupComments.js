import cron from 'node-cron'
import dayjs from 'dayjs'
import { Ticket } from '../models/ticket.model'
import { Comments } from '../models/comments.model'

cron.schedule('0 2 * * *', async () => {
  try {
    const cutoffDate = dayjs().subtract(29, 'day').toDate();

    const tickets = await Ticket.find({
      status: 'closed',
      closedAt: { $lte: cutoffDate }
    });

    if (tickets.length === 0) {
      console.log(' No tickets ready for cleanup.');
      return;
    }

    for (const ticket of tickets) {
      const ticketId = ticket._id;

      if (Array.isArray(ticket.attachments)) {
        for (const file of ticket.attachments) {
          if (file.public_id) {
            try {
              await cloudinary.uploader.destroy(file.public_id);
              console.log(`Deleted ticket file: ${file.public_id}`);
            } catch (err) {
              console.error(` Error deleting ticket file: ${file.public_id}`, err.message);
            }
          }
        }
      }

      const comments = await Comments.find({ ticketId });

      for (const comment of comments) {
        if (comment.attachment && comment.attachment.public_id) {
          try {
            await cloudinary.uploader.destroy(comment.attachment.public_id);
            console.log(` Deleted comment file: ${comment.attachment.public_id}`);
          } catch (err) {
            console.error(` Error deleting comment file: ${comment.attachment.public_id}`, err.message);
          }
        }

        try {
          await Comments.deleteOne({ _id: comment._id });
          console.log(`Deleted comment: ${comment._id}`);
        } catch (err) {
          console.error(` Failed to delete comment: ${comment._id}`, err.message);
        }
      }

    }

    console.log(`Cleanup completed for ${tickets.length} ticket(s).`);

  } catch (err) {
    console.error('Cron job failed:', err.message);
  }
});

