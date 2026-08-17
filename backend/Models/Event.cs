using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Event
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    // Stored without a timezone offset: events are scheduled in local campus time.
    [Column(TypeName = "timestamp without time zone")]
    public DateTime DateTime { get; set; }

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    // Kept as a plain string (not a foreign key) to avoid EF Core
    // migration conflicts with the Club table owned by another team member.
    [MaxLength(50)]
    public string ClubId { get; set; } = string.Empty;
}
