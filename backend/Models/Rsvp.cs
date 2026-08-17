using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public enum RsvpStatus
{
    Attending,
    Waitlisted,
    Cancelled,
}

public class Rsvp
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string StudentName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string StudentIdNumber { get; set; } = string.Empty;

    public int EventId { get; set; }

    [MaxLength(500)]
    public string DietaryNotes { get; set; } = string.Empty;

    public RsvpStatus Status { get; set; } = RsvpStatus.Attending;
}
